import { useEffect } from 'react';

export function useDocumentMeta(options: {
  title: string;
  description?: string;
  isPrivate?: boolean;
}) {
  useEffect(() => {
    document.title = `${options.title} | SPG11 Journey Tracker`;

    if (options.description) {
      let descTag = document.querySelector('meta[name="description"]');
      if (descTag) {
        descTag.setAttribute('content', options.description);
      }
    }

    let robotsTag = document.querySelector('meta[name="robots"]');
    if (!robotsTag) {
      robotsTag = document.createElement('meta');
      robotsTag.setAttribute('name', 'robots');
      document.head.appendChild(robotsTag);
    }
    robotsTag.setAttribute(
      'content',
      options.isPrivate ? 'noindex, nofollow' : 'index, follow'
    );
  }, [options.title, options.description, options.isPrivate]);
}
