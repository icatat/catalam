'use client';

import { useEffect } from 'react';

export function AutoLinkPreview() {
  useEffect(() => {
    const loadPreviews = async () => {
      // Find all links with data-preview attribute
      const previewLinks = document.querySelectorAll('a[data-preview="true"]');

      for (const link of previewLinks) {
        const url = link.getAttribute('href');
        if (!url || link.getAttribute('data-loaded') === 'true') continue;

        try {
          // Fetch preview data
          const response = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
          if (!response.ok) continue;

          const data = await response.json();

          // Create preview card HTML
          const previewCard = document.createElement('div');
          previewCard.style.cssText = 'display: flex; flex-direction: row; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin: 24px 0; text-decoration: none;';

          let innerHTML = '';

          if (data.image) {
            innerHTML += `<img src="${data.image}" alt="${data.title}" style="width: 180px; height: 120px; object-fit: cover; flex-shrink: 0;" onerror="this.style.display='none'" />`;
          }

          innerHTML += `
            <div style="padding: 16px; flex: 1; display: flex; flex-direction: column; justify-content: center;">
              <h4 style="margin: 0 0 8px 0; color: #1976d2; font-size: 1.1rem; font-weight: 600;">${data.title || url}</h4>
              ${data.description ? `<p style="margin: 0 0 8px 0; color: #666; font-size: 0.85rem; line-height: 1.4;">${data.description}</p>` : ''}
              <span style="color: #999; font-size: 0.75rem;">${data.domain}</span>
            </div>
          `;

          previewCard.innerHTML = innerHTML;

          // Replace the link with the preview card, but make it clickable
          const wrapper = document.createElement('a');
          wrapper.href = url;
          wrapper.target = '_blank';
          wrapper.rel = 'noopener noreferrer';
          wrapper.style.cssText = 'text-decoration: none; display: block;';
          wrapper.appendChild(previewCard);

          link.parentNode?.replaceChild(wrapper, link);
          link.setAttribute('data-loaded', 'true');
        } catch (error) {
          console.error('Error loading preview:', error);
        }
      }
    };

    loadPreviews();
  }, []);

  return null;
}
