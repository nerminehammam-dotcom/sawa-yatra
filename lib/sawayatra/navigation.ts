import type { MembershipStatus } from "./model";

export interface NavigationSession {
  readonly isSignedIn: boolean;
  readonly membershipStatus: MembershipStatus;
}

export interface NavigationLink {
  readonly label: string;
  readonly href: string;
}

export function rightHandNavigation(
  session: NavigationSession,
): readonly NavigationLink[] {
  if (!session.isSignedIn) {
    return [
      { label: "Join", href: "/club/apply" },
      { label: "Sign in", href: "/sign-in" },
    ];
  }
  switch (session.membershipStatus) {
    case "member":
      return [{ label: "My Sawayatra", href: "/my" }];
    case "applied":
      return [{ label: "My application", href: "/my/application" }];
    case "lapsed":
      return [
        { label: "Renew", href: "/club/apply" },
        { label: "My account", href: "/my/account" },
      ];
    case "none":
      return [
        { label: "Join", href: "/club/apply" },
        { label: "My account", href: "/my/account" },
      ];
    case "declined":
      return [{ label: "My account", href: "/my/account" }];
  }
}

