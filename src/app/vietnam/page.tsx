'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { MainPageCard } from '@/components/MainPageCard';
import RSVPModal from '@/components/RSVPModal';
import RSVPConfirmation from '@/components/RSVPConfirmation';
import { Box, useTheme, Container, Typography, Card, CardActionArea, CardContent, Modal } from '@mui/material';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import Cookies from 'js-cookie';
import { Location, GuestData } from '@/models/RSVP';
import { ItineraryEvent } from '@/types/wedding';
import { useRSVPHandler } from '@/lib/useRSVPHandler';
import { WEDDING_INFO } from '@/lib/constants';
import CustomButton from '@/components/Button';

const VIETNAM_INVITE = {
  en: {
    label: 'English',
    opening:
      "Fueled by boarding passes, late-night calls, and a little bit of stubbornness, we're beginning our journey together.",
    familiesLabel: 'Together with our families',
    closing:
      'we invite you to celebrate a love story built across miles, time zones, and years of waiting.',
    groom: 'Lâm Nguyễn',
    bride: 'Cătălina Ionescu',
    groomParents: ['Hồng Hạnh Nguyễn', 'Phú Kiều Nguyễn'],
    brideParents: ['Ana Filip Ionescu', 'Lucian Ionescu'],
    roleMother: "Cătălina's mother",
    roleFather: "Cătălina's father",
    roleGroomFamily: "Lâm's family",
  },
  vi: {
    label: 'Tiếng Việt',
    opening:
      'Được tiếp thêm động lực từ những tấm vé máy bay, những cuộc gọi lúc nửa đêm và một chút bướng bỉnh, chúng tôi bắt đầu hành trình chung của cuộc đời.',
    familiesLabel: 'Cùng với gia đình hai bên',
    closing:
      'chúng tôi trân trọng kính mời quý vị đến chung vui và chứng kiến một chuyện tình được vun đắp qua bao dặm đường, những múi giờ cách biệt và những năm tháng đợi chờ.',
    groom: 'Nguyễn Lâm',
    bride: 'Ionescu Cătălina',
    groomParents: ['Nguyễn Hồng Hạnh', 'Nguyễn Phú Kiều'],
    brideParents: ['Filip Ionescu Ana', 'Ionescu Lucian'],
    roleMother: 'Mẹ của Cătălina',
    roleFather: 'Bố của Cătălina',
    roleGroomFamily: 'Gia đình của Lâm',
  },
} as const;

type VietnamInviteLang = keyof typeof VIETNAM_INVITE;

export default function VietnamWedding() {
  const theme = useTheme();
  const router = useRouter();
  const [guestData, setGuestData] = useState<GuestData | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [rsvpableEvents, setRsvpableEvents] = useState<ItineraryEvent[]>([]);
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [inviteLang, setInviteLang] = useState<VietnamInviteLang>('en');
  const [openPhoto, setOpenPhoto] = useState<{ src: string; name: string; role: string } | null>(null);
  const invite = VIETNAM_INVITE[inviteLang];
  const parentNameSx = {
    fontFamily: '"Cormorant Garamond", serif',
    color: theme.palette.primary.dark,
    fontWeight: 600,
    fontSize: { xs: '1.2rem', md: '1.5rem' },
    lineHeight: 1.7,
    letterSpacing: '0.01em',
  };
  const familyPhotos = [
    { src: '/LamCataMom.png', name: invite.brideParents[0], role: invite.roleMother },
    { src: '/LamCataDad.png', name: invite.brideParents[1], role: invite.roleFather },
    { src: '/LamFamily.png', name: invite.roleGroomFamily, role: '' },
  ];

  const location = Location.VIETNAM;
  const weddingInfo = WEDDING_INFO[location];
  const { handleRSVP, confirmationData, showConfirmation, setShowConfirmation } = useRSVPHandler(
    guestData,
    location,
    (data) => setGuestData(data)
  );

  useEffect(() => {
    const savedInviteId = Cookies.get('invite_id');
    if (!savedInviteId) {
      router.push('/');
      return;
    }

    fetch('/api/vietnam-timeline')
      .then(r => r.json())
      .then(data => {
        const allEvents = (data.days || []).flatMap((d: { date?: string; events?: ItineraryEvent[] }) =>
          (d.events || []).map((e: ItineraryEvent) => ({ ...e, date: d.date }))
        );
        setRsvpableEvents(allEvents.filter((e: ItineraryEvent) => e.type === 'Event'));
      })
      .catch(() => {});

    fetch('/api/guest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invite_id: savedInviteId }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.vietnam) {
          setGuestData({
            invite_id: savedInviteId,
            first_name: data.first_name,
            last_name: data.last_name,
            vietnam: data.vietnam,
            romania: data.romania,
            group: data.group,
            has_rsvp_romania: data.has_rsvp_romania,
            has_rsvp_vietnam: data.has_rsvp_vietnam,
            invited_events: data.invited_events_vietnam,
            group_members: data.group_members || [],
          });
          setIsVerifying(false);
        } else {
          router.push('/');
        }
      })
      .catch(() => {
        Cookies.remove('invite_id');
        router.push('/');
      });
  }, [location, router]);

  // Loading state
  if (isVerifying || !guestData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Box
            className="animate-spin rounded-full h-12 w-12 mx-auto mb-4"
            sx={{
              borderBottom: `2px solid ${theme.palette.primary.main}`,
            }}
          />
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Loading...</Typography>
        </div>
      </div>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Subtle textured background — image only */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(/background-main.webp)`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'contain',
          opacity: 0.5,
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />
      <Navigation currentPage="vietnam" showRomania={guestData?.romania} showVietnam={true} />
      <Container maxWidth="xl" sx={{ height: '100%', display: 'flow' }}>
        {/* Hero */}
        <Box sx={{
          pt: { xs: 8, md: 10 },
          pb: 4,
          textAlign: 'center'
        }}>
          <Typography
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: 'italic',
              color: '#a8916b',
              fontSize: '1.25rem',
              letterSpacing: '0.4em',
              mb: 2,
            }}
          >
            ·   ·   ·
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontFamily: '"Arizonia", cursive',
              color: theme.palette.primary.dark,
              fontWeight: 400,
              mb: 1.5,
              fontSize: { xs: '3.5rem', md: '5rem' },
              lineHeight: 1.05,
            }}
          >
            Vietnam
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Thasadith", sans-serif',
              color: '#8e645d',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.32em',
              mb: 2,
            }}
          >
            {guestData.has_rsvp_vietnam ? 'Your RSVP is confirmed' : `Welcome, ${guestData.first_name}`}
          </Typography>
        </Box>

        {/* Invitation postcard */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pb: 6,
          }}
        >
          {/* Postcard — polaroid on the left, message on the right */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: { xs: 3, md: 5 },
              maxWidth: 1080,
              width: '100%',
              mx: 'auto',
              p: { xs: 3, md: 5 },
              borderRadius: 3,
              backgroundColor: '#f6e9e4',
              border: '1px solid rgba(184, 136, 128, 0.22)',
              boxShadow: '0 20px 55px rgba(120, 90, 60, 0.13)',
            }}
          >
            {/* Polaroid photo (left) */}
            <Box sx={{ flexShrink: 0 }}>
              <MainPageCard
                polaroid
                imageSrc="/photo_0.webp"
                alt="Cătălina and Lâm in Vietnam"
                animationDelay={0.1}
                sx={{ maxWidth: { xs: 240, md: 300 } }}
                bottomContent={
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      sx={{
                        fontFamily: '"Thasadith", sans-serif',
                        color: '#333',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.16em',
                      }}
                    >
                      {weddingInfo.location}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: '"Cormorant Garamond", serif',
                        fontStyle: 'italic',
                        color: '#666',
                        fontSize: '0.95rem',
                        mt: 0.5,
                      }}
                    >
                      {weddingInfo.date}
                    </Typography>
                  </Box>
                }
              />
            </Box>

            {/* Message (right) */}
            <Box
              sx={{
                flex: 1,
                width: '100%',
                textAlign: 'center',
                borderTop: { xs: '1px dashed rgba(184, 136, 128, 0.35)', md: 'none' },
                borderLeft: { md: '1px dashed rgba(184, 136, 128, 0.35)' },
                pt: { xs: 3, md: 0 },
                pl: { md: 5 },
              }}
            >
              {/* Language toggle */}
              <Box
                sx={{
                  display: 'inline-flex',
                  gap: '4px',
                  mb: 3,
                  p: '3px',
                  borderRadius: 999,
                  border: '1px solid rgba(184, 136, 128, 0.4)',
                }}
              >
                {(Object.keys(VIETNAM_INVITE) as VietnamInviteLang[]).map((lng) => (
                  <Box
                    key={lng}
                    component="button"
                    onClick={() => setInviteLang(lng)}
                    sx={{
                      cursor: 'pointer',
                      border: 'none',
                      borderRadius: 999,
                      px: 2,
                      py: 0.5,
                      fontFamily: '"Thasadith", sans-serif',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: inviteLang === lng ? '#fff' : '#8e645d',
                      backgroundColor: inviteLang === lng ? '#b88880' : 'transparent',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {VIETNAM_INVITE[lng].label}
                  </Box>
                ))}
              </Box>

              {/* Opening */}
              <Typography
                sx={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontStyle: 'italic',
                  color: '#4a3a32',
                  fontSize: { xs: '1.2rem', md: '1.4rem' },
                  lineHeight: 1.85,
                  mb: 3.5,
                }}
              >
                {invite.opening}
              </Typography>

              {/* Families label */}
              <Typography
                sx={{
                  fontFamily: '"Thasadith", sans-serif',
                  color: '#8e645d',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.28em',
                  mb: 2,
                }}
              >
                {invite.familiesLabel}
              </Typography>

              {/* Names + parents in two aligned columns (groom's family first) */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr',
                  columnGap: { xs: 1, md: 2 },
                  rowGap: 1.25,
                  alignItems: 'start',
                }}
              >
                {/* Row 1 — names */}
                <Typography
                  sx={{
                    fontFamily: '"Arizonia", cursive',
                    color: theme.palette.primary.dark,
                    fontSize: { xs: '1.7rem', md: '2.4rem' },
                    lineHeight: 1.15,
                    textAlign: 'center',
                  }}
                >
                  {invite.groom}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontStyle: 'italic',
                    color: '#a8916b',
                    fontSize: { xs: '1.25rem', md: '1.75rem' },
                    alignSelf: 'center',
                  }}
                >
                  &amp;
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Arizonia", cursive',
                    color: theme.palette.primary.dark,
                    fontSize: { xs: '1.7rem', md: '2.4rem' },
                    lineHeight: 1.15,
                    textAlign: 'center',
                  }}
                >
                  {invite.bride}
                </Typography>

                {/* Row 2 — parents (aligned under each name) */}
                <Box>
                  <Typography sx={parentNameSx}>{invite.groomParents[0]}</Typography>
                  <Typography sx={parentNameSx}>{invite.groomParents[1]}</Typography>
                </Box>
                <Box />
                <Box>
                  <Typography sx={parentNameSx}>{invite.brideParents[0]}</Typography>
                  <Typography sx={parentNameSx}>{invite.brideParents[1]}</Typography>
                </Box>
              </Box>

              {/* Closing */}
              <Typography
                sx={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontStyle: 'italic',
                  color: '#4a3a32',
                  fontSize: { xs: '1.2rem', md: '1.4rem' },
                  lineHeight: 1.85,
                  mt: 3.5,
                }}
              >
                {invite.closing}
              </Typography>
            </Box>
          </Box>

          {/* Family polaroids */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'nowrap',
              justifyContent: { xs: 'flex-start', md: 'center' },
              alignItems: 'flex-start',
              gap: { xs: 2, md: 3 },
              mt: { xs: 5, md: 6 },
              maxWidth: 1080,
              mx: 'auto',
              px: 2,
              overflowX: 'auto',
            }}
          >
            {familyPhotos.map((p) => (
              <Box
                key={p.src}
                onClick={() => setOpenPhoto(p)}
                sx={{
                  width: { xs: 170, md: 230 },
                  flexShrink: 0,
                  backgroundColor: '#fff',
                  p: 1,
                  pb: 1.5,
                  borderRadius: '2px',
                  boxShadow: '0 10px 26px rgba(120, 90, 60, 0.16)',
                  cursor: 'pointer',
                }}
              >
                <Box
                  component="img"
                  src={p.src}
                  alt={p.role || p.name}
                  sx={{
                    display: 'block',
                    width: '100%',
                    aspectRatio: '1 / 1',
                    objectFit: 'contain',
                  }}
                />
                <Box sx={{ textAlign: 'center', pt: 1.25, px: 0.5 }}>
                  <Typography
                    sx={{
                      fontFamily: '"Cormorant Garamond", serif',
                      color: theme.palette.primary.dark,
                      fontWeight: 600,
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      lineHeight: 1.25,
                    }}
                  >
                    {p.name}
                  </Typography>
                  {p.role && (
                    <Typography
                      sx={{
                        fontFamily: '"Thasadith", sans-serif',
                        color: '#8e645d',
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.16em',
                        mt: 0.5,
                      }}
                    >
                      {p.role}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>

          {/* Enlarged photo */}
          <Modal
            open={Boolean(openPhoto)}
            onClose={() => setOpenPhoto(null)}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
          >
            <Box
              onClick={() => setOpenPhoto(null)}
              sx={{
                outline: 'none',
                cursor: 'pointer',
                backgroundColor: '#fff',
                p: { xs: 1.5, md: 2 },
                pb: { xs: 2.5, md: 3 },
                borderRadius: '2px',
                boxShadow: '0 30px 80px rgba(0, 0, 0, 0.4)',
                maxWidth: { xs: '90vw', md: 520 },
              }}
            >
              {openPhoto && (
                <>
                  <Box
                    component="img"
                    src={openPhoto.src}
                    alt={openPhoto.role || openPhoto.name}
                    sx={{
                      display: 'block',
                      width: '100%',
                      height: 'auto',
                      maxHeight: '72vh',
                      objectFit: 'contain',
                    }}
                  />
                  <Box sx={{ textAlign: 'center', pt: 2 }}>
                    <Typography
                      sx={{
                        fontFamily: '"Cormorant Garamond", serif',
                        color: theme.palette.primary.dark,
                        fontWeight: 600,
                        fontSize: '1.3rem',
                      }}
                    >
                      {openPhoto.name}
                    </Typography>
                    {openPhoto.role && (
                      <Typography
                        sx={{
                          fontFamily: '"Thasadith", sans-serif',
                          color: '#8e645d',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.18em',
                          mt: 0.5,
                        }}
                      >
                        {openPhoto.role}
                      </Typography>
                    )}
                  </Box>
                </>
              )}
            </Box>
          </Modal>

          {/* RSVP Button */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <CustomButton
              onClick={() => setShowRSVPModal(true)}
              variant={guestData.has_rsvp_vietnam ? "outlined" : "contained"}
              size="large"
              sx={{ px: 5, py: 1.5 }}
            >
              {guestData.has_rsvp_vietnam ? 'Update RSVP' : 'RSVP'}
            </CustomButton>
          </Box>
        </Box>

        {/* Navigation Cards */}
        <ScrollReveal direction="up" delay={0.1}>
          <section style={{ padding: theme.spacing(4, 0, 8, 0) }}>
            <Box sx={{ maxWidth: '900px', mx: 'auto', px: 2 }}>
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: { xs: 2.5, md: 3 }
              }}>
                {/* Itinerary Card */}
                <Card sx={{ '&:hover': { transform: 'translateY(-2px)' } }}>
                  <CardActionArea onClick={() => router.push('/vietnam/itinerary')}>
                    <CardContent sx={{ p: { xs: 4, md: 5 }, textAlign: 'center' }}>
                      <Typography
                        sx={{
                          fontFamily: '"Cormorant Garamond", serif',
                          color: theme.palette.primary.dark,
                          fontSize: '1.75rem',
                          fontWeight: 500,
                          mb: 0.75,
                          letterSpacing: '-0.005em',
                        }}
                      >
                        Itinerary
                      </Typography>
                      <Typography
                        sx={{
                          color: '#8e645d',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.3em',
                        }}
                      >
                        The schedule
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>

                {/* Details & FAQ Card */}
                <Card sx={{ '&:hover': { transform: 'translateY(-2px)' } }}>
                  <CardActionArea onClick={() => router.push('/vietnam/details')}>
                    <CardContent sx={{ p: { xs: 4, md: 5 }, textAlign: 'center' }}>
                      <Typography
                        sx={{
                          fontFamily: '"Cormorant Garamond", serif',
                          color: theme.palette.primary.dark,
                          fontSize: '1.75rem',
                          fontWeight: 500,
                          mb: 0.75,
                          letterSpacing: '-0.005em',
                        }}
                      >
                        Details &amp; FAQ
                      </Typography>
                      <Typography
                        sx={{
                          color: '#8e645d',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.3em',
                        }}
                      >
                        Venue &amp; Guide
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Box>
            </Box>
          </section>
        </ScrollReveal>
      </Container>

      {/* RSVP Modal */}
      {guestData && (
        <RSVPModal
          isOpen={showRSVPModal}
          onClose={() => setShowRSVPModal(false)}
          onSubmit={handleRSVP}
          guestData={guestData}
          location={location}
          variant="primary"
          rsvpableEvents={rsvpableEvents}
        />
      )}

      {/* RSVP Confirmation */}
      {guestData && (
        <RSVPConfirmation
          isVisible={showConfirmation}
          attending={confirmationData.attending}
          guestName={`${guestData.first_name} ${guestData.last_name}`}
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
    </Box>
  );
}