'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';

import RSVPModal from '@/components/RSVPModal';
import RSVPConfirmation from '@/components/RSVPConfirmation';
import { InviteVerification } from '@/components/InviteVerification';
import { RSVPFormData } from '@/types/wedding';
import { useLanguage } from '@/contexts/LanguageContext';
import CustomButton from '@/components/Button';
import { ScrollReveal, ScrollProgress } from '@/components/ui/scroll-reveal';
import Cookies from 'js-cookie';
import { useTheme, Box, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { Location, GuestData } from '@/models/RSVP';
import { 
  handleReconfirmation, 
  submitRSVP, 
  createEmailPromise,
  RSVPHandlerOptions 
} from '@/lib/rsvpUtils';
import { WEDDING_INFO, MESSAGES } from '@/lib/constants';

interface WeddingPageProps {
  location: Location;
}

export default function WeddingPageLayout({ location }: WeddingPageProps) {
  const { t } = useLanguage();
  const theme = useTheme();
  const [guestData, setGuestData] = useState<GuestData | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{
    attending: boolean;
    email: string;
    emailSent: boolean;
  }>({ attending: false, email: '', emailSent: false });

  const weddingInfo = WEDDING_INFO[location];
  const isRomania = location === Location.ROMANIA;
  const locationName = isRomania ? 'Romania' : 'Vietnam';

  useEffect(() => {
    const savedInviteId = Cookies.get('invite_id');
    if (savedInviteId) {
      fetch('/api/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invite_id: savedInviteId }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.location?.includes(location)) {
            setGuestData({
              invite_id: savedInviteId,
              full_name: data.full_name,
              location: data.location,
              rsvp: data.rsvp || []
            });
          }
          setIsVerifying(false);
        })
        .catch(() => {
          Cookies.remove('invite_id');
          setIsVerifying(false);
        });
    } else {
      setIsVerifying(false);
    }
  }, [location]);

  const handleInviteVerified = (data: GuestData) => {
    setGuestData(data);
  };

  const handleRSVP = async (formData: RSVPFormData): Promise<void> => {
    if (!guestData) return;

    try {
      const options: RSVPHandlerOptions = { guestData, formData, location, setGuestData };
      
      // Check if this is a re-confirmation
      const isReconfirmation = await handleReconfirmation(options);
      if (isReconfirmation) {
        setConfirmationData({
          attending: formData.rsvp === 'true',
          email: formData.email,
          emailSent: true
        });
        setShowConfirmation(true);
        return;
      }

      // Submit RSVP
      const rsvpResponse = await submitRSVP(options);
      const rsvpResult = await rsvpResponse.json();

      if (rsvpResult.success) {
        // Refetch guest data from database to get updated RSVP status
        const updatedGuestResponse = await fetch('/api/guest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invite_id: guestData.invite_id }),
        });
        const updatedGuestData = await updatedGuestResponse.json();
        setGuestData({
          invite_id: guestData.invite_id,
          full_name: updatedGuestData.full_name,
          location: updatedGuestData.location,
          rsvp: updatedGuestData.rsvp || []
        });
      }

      // Create email promise
      const emailPromise = createEmailPromise({
        name: formData.name || guestData.full_name,
        email: formData.email,
        attending: formData.rsvp === 'true',
        location
      });

      // Show confirmation immediately
      setConfirmationData({
        attending: formData.rsvp === 'true',
        email: formData.email,
        emailSent: false
      });
      setShowConfirmation(true);

      // Handle email in background
      try {
        const emailResult = await emailPromise;
        const emailData = await emailResult.json();
        setConfirmationData(prev => ({
          ...prev,
          emailSent: emailData.success
        }));
      } catch (emailError) {
        console.error('Email error:', emailError);
        setConfirmationData(prev => ({
          ...prev,
          emailSent: false
        }));
      }
      
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert(MESSAGES.RSVP_ERROR(location));
    }
  };

  // Loading state
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Box
            className="animate-spin rounded-full h-12 w-12 mx-auto mb-4"
            sx={{
              borderBottom: `2px solid ${theme.palette.primary.main}`,
            }}
          />
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>{t('wedding.verification.loading')}</Typography>
        </div>
      </div>
    );
  }

  // Invite verification
  if (!guestData) {
    return (
      <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${theme.palette.primary.light}45 0%, ${theme.palette.primary.light}40 25%, ${theme.palette.primary.light}50 50%, ${theme.palette.primary.main}20 75%, ${theme.palette.primary.light}30 100%), url(/landmarks.png)`, backgroundRepeat: 'repeat', backgroundSize: 'auto' }}>
        <InviteVerification 
          location={location}
          onVerified={handleInviteVerified}
        />
      </div>
    );
  }

  return (
    <>
      <ScrollProgress />
      <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${theme.palette.primary.light}25 0%, ${theme.palette.primary.light}20 25%, ${theme.palette.primary.light}30 50%, ${theme.palette.primary.light}15 75%, ${theme.palette.primary.light}20 100%), url(/landmarks.png)`, backgroundRepeat: 'repeat', backgroundSize: 'auto' }}>
        <Navigation currentPage={isRomania ? "romania" : "vietnam"} />
      
        {/* Personalized Welcome Section */}
        {guestData && (
          <Box sx={{ 
            pt: { xs: 8, md: 10 }, 
            pb: 12, 
            px: 3,
            textAlign: 'center',
            position: 'relative',
            backgroundImage: `url(${weddingInfo.heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: { xs: 0, md: 4 },
            mx: { xs: 0, md: 4 },
            mt: { xs: 0, md: 3 },
            boxShadow: { xs: 'none', md: theme.shadows[6] },
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.75)',
              zIndex: 1
            },
            '& > *': {
              position: 'relative',
              zIndex: 2
            }
          }}>
            {/* Personalized Message */}
            {guestData.rsvp.includes(location) ? (
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  color: theme.palette.primary.dark,
                  fontWeight: 700,
                  mb: 3,
                  maxWidth: '900px',
                  mx: 'auto',
                  textShadow: '0 1px 3px rgba(0,0,0,0.15)',
                  lineHeight: 1.2
                }}
              >
                {t('wedding.welcome.confirmed', { 
                  name: guestData.full_name.split(' ')[0],
                  location: locationName 
                })}
              </Typography>
            ) : (
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  color: theme.palette.primary.dark,
                  fontWeight: 700,
                  mb: 3,
                  maxWidth: '900px',
                  mx: 'auto',
                  textShadow: '0 1px 3px rgba(0,0,0,0.15)',
                  lineHeight: 1.2
                }}
              >
                {t('wedding.welcome.pending', { 
                  name: guestData.full_name.split(' ')[0],
                  location: locationName 
                })}
              </Typography>
            )}

            <Typography 
              variant="h5" 
              sx={{ 
                color: theme.palette.text.secondary,
                mb: 5,
                fontWeight: 500,
                maxWidth: '700px',
                mx: 'auto',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                opacity: 0.8
              }}
            >
              {weddingInfo.date} • {weddingInfo.location}
            </Typography>

            {/* RSVP/Update Button */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              {guestData.rsvp.includes(location) && (
                <CheckCircle 
                  sx={{ 
                    color: theme.palette.success.main, 
                    fontSize: '1.5rem' 
                  }} 
                />
              )}
              <CustomButton
                onClick={() => setShowRSVPModal(true)}
                variant={guestData.rsvp.includes(location) ? "text" : "contained"}
                size={guestData.rsvp.includes(location) ? "medium" : "large"}
                sx={guestData.rsvp.includes(location) ? {
                  // Subtle styling for confirmed users
                  px: 3,
                  py: 1.5,
                  fontSize: '0.95rem',
                  fontWeight: 400,
                  borderRadius: 2,
                  textTransform: 'none',
                  color: theme.palette.text.secondary,
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.3s ease'
                } : {
                  // Prominent styling for non-confirmed users
                  px: 6,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: theme.shadows[4],
                  '&:hover': {
                    boxShadow: theme.shadows[8],
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {guestData.rsvp.includes(location) 
                  ? t('rsvp.button.update')
                  : t('rsvp.button.now')
                }
              </CustomButton>
            </Box>
          </Box>
        )}

        {/* Fallback for non-verified guests */}
        {!guestData && (
          <HeroSection
            title={t('wedding.hero.title', { location: weddingInfo.name })}
            date={weddingInfo.date}
            subtitle={weddingInfo.subtitle}
            location={weddingInfo.location}
            backgroundImage={weddingInfo.heroImage}
          />
        )}

        {/* Location/Venue Section */}
        <ScrollReveal direction="up" delay={0.1}>
          <section style={{ padding: theme.spacing(8, 0) }}>
            <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 2 }}>
              <Typography variant="h2" component="h2" sx={{ 
                color: theme.palette.primary.main, 
                fontWeight: 700, 
                mb: 6, 
                textAlign: 'center' 
              }}>
                {t('wedding.location.title')}
              </Typography>
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                gap: 4, 
                alignItems: 'center' 
              }}>
                {/* Location Details */}
                <Box sx={{ 
                  p: 4, 
                  bgcolor: 'background.paper', 
                  borderRadius: 3, 
                  boxShadow: theme.shadows[4] 
                }}>
                  <Typography variant="h4" component="h3" sx={{ 
                    color: theme.palette.text.primary, 
                    fontWeight: 600, 
                    mb: 3 
                  }}>
                    {isRomania ? 'Oradea, Romania' : 'Cam Ranh, Vietnam'}
                  </Typography>
                  
                  <Typography variant="body1" sx={{ 
                    color: theme.palette.text.secondary, 
                    mb: 3, 
                    lineHeight: 1.7 
                  }}>
                    {isRomania ? 
                      'Join us in the beautiful city of Oradea for our Romanian wedding celebration. Known for its stunning architecture and rich cultural heritage, Oradea provides the perfect backdrop for our special day.' :
                      'Celebrate with us in vibrant Cam Ranh for our Vietnamese wedding ceremony. This bustling metropolis, rich in history and tradition, will host our joyous celebration.'
                    }
                  </Typography>
                  
                  {/* Venue Address */}
                  <Box sx={{ 
                    p: 3, 
                    bgcolor: theme.palette.grey[50], 
                    borderRadius: 2, 
                    border: `1px solid ${theme.palette.grey[200]}` 
                  }}>
                    <Typography variant="h6" sx={{ 
                      color: theme.palette.primary.main, 
                      fontWeight: 600, 
                      mb: 1 
                    }}>
                      {t('wedding.venue.title')}
                    </Typography>
                    <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                      {t('wedding.venue.tbd')}
                    </Typography>
                  </Box>
                </Box>

                {/* Google Maps Embed */}
                <Box sx={{ 
                  borderRadius: 3, 
                  overflow: 'hidden', 
                  boxShadow: theme.shadows[8],
                  '& iframe': {
                    width: '100%',
                    height: { xs: '300px', md: '450px' },
                    border: 0
                  }
                }}>
                  {isRomania ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2716.889008262144!2d22.072338490107096!3d47.0816401496941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x474637651b7f20c1%3A0x9e1984228909fcf2!2sCamelot%20Resort!5e0!3m2!1sen!2sus!4v1756786599009!5m2!1sen!2sus"
                        allowFullScreen
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Camelot Resort - Oradea, Romania"
                        style={{ width: '100%', height: '300px', border: 0, borderRadius: '12px' }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <div dangerouslySetInnerHTML={{
                          __html: `<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/camelotresort.ro/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/camelotresort.ro/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">View this profile on Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"></div></div></a><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/camelotresort.ro/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px;" target="_blank">Camelot Resort</a> (@<a href="https://www.instagram.com/camelotresort.ro/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px;" target="_blank">camelotresort.ro</a>) • Instagram photos and videos</p></div></blockquote>
                        <script async src="//www.instagram.com/embed.js"></script>`
                        }} />
                      </Box>
                    </Box>
                  ) : (
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.5942044923677!2d109.19268197506148!3d12.071417288167309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31708bff67aac6b7%3A0xd15bf6357e2930a3!2sAlma%20Resort%20Cam%20Ranh!5e0!3m2!1sen!2sus!4v1756786279316!5m2!1sen!2sus"
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Alma Resort - Cam Ranh, Vietnam"
                    />
                  )}
                </Box>
              </Box>
            </Box>
          </section>
        </ScrollReveal>


        {/* RSVP Modal */}
        {guestData && (
          <RSVPModal
            isOpen={showRSVPModal}
            onClose={() => setShowRSVPModal(false)}
            onSubmit={handleRSVP}
            guestData={guestData}
            location={location}
            variant="primary"
          />
        )}

        {/* RSVP Confirmation */}
        {guestData && (
          <RSVPConfirmation
            isVisible={showConfirmation}
            attending={confirmationData.attending}
            guestName={guestData.full_name}
            email={confirmationData.email}
            location={location}
            onModify={() => {
              setShowConfirmation(false);
              setShowRSVPModal(true);
            }}
            onClose={() => setShowConfirmation(false)}
            variant="primary"
            emailSent={confirmationData.emailSent}
          />
        )}
      </div>
    </>
  );
}