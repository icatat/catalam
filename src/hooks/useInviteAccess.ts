'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface InviteAccess {
  showRomania: boolean;
  showVietnam: boolean;
  isLoading: boolean;
}

export function useInviteAccess(): InviteAccess {
  const [showRomania, setShowRomania] = useState(false);
  const [showVietnam, setShowVietnam] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const savedInviteId = Cookies.get('invite_id');
      const skippedStatus = Cookies.get('invite_skipped');

      // If user skipped, don't show wedding pages
      if (skippedStatus === 'true') {
        setShowRomania(false);
        setShowVietnam(false);
        setIsLoading(false);
        return;
      }

      // If no invite, don't show wedding pages
      if (!savedInviteId) {
        setShowRomania(false);
        setShowVietnam(false);
        setIsLoading(false);
        return;
      }

      // Check with API what locations user has access to
      try {
        const response = await fetch('/api/guest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invite_id: savedInviteId }),
        });

        if (response.ok) {
          const data = await response.json();
          setShowRomania(data.romania || false);
          setShowVietnam(data.vietnam || false);
        } else {
          setShowRomania(false);
          setShowVietnam(false);
        }
      } catch {
        setShowRomania(false);
        setShowVietnam(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, []);

  return { showRomania, showVietnam, isLoading };
}
