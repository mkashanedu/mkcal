/**
 * Safe back navigation — agar peeche koi screen na ho (masalan page drawer se
 * replace ke zariye khula ho) to app band honay / khali back ke bajaye Home.
 */
export function goBack(router: {
  canGoBack: () => boolean;
  back: () => void;
  replace: (p: any) => void;
}) {
  try {
    if (router.canGoBack()) router.back();
    else router.replace("/" as any);
  } catch {
    router.replace("/" as any);
  }
}
