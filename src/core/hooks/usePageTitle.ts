import { useEffect } from 'react';

export default function userPageTitle(title: string) {
  const BASE_TITLE = 'AlgaNews';

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    document.title = `${BASE_TITLE} - ${title}`;
  });
}
