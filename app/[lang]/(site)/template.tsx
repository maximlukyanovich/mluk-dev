import { ViewTransition } from "react";

/**
 * Re-mounted on every navigation, unlike the layout: the page fades out to
 * the left and the next one in from the right (`page` in web.css), while the
 * header and footer in the layout stay put.
 */
export default function SiteTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      {children}
    </ViewTransition>
  );
}
