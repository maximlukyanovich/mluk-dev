import Image from "next/image";

import type { Dictionary } from "@/shared/i18n/dictionaries";

import type { Profile } from "../lib/types";

type ProfileCardProps = {
  profile: Profile;
  copy: Dictionary["home"];
};

/** The kit's Photo in the profile card: photo with the lime ring, status, facts. */
export function ProfileCard({ profile, copy }: ProfileCardProps) {
  const name = `${profile.name.first} ${profile.name.last}`;

  return (
    <aside
      aria-label={copy.profile}
      className="mk-profile mk-glass [--photo:min(196px,52vw)]"
    >
      <div className="flex justify-between self-stretch px-2 font-mono text-[11px] leading-[1.4] font-medium tracking-[0.12em] text-muted uppercase">
        <span>{copy.profile}</span>
        <span className="text-peri">{profile.languages}</span>
      </div>
      <div className="mk-photo">
        <div className="mk-photo-ring">
          {profile.photo ? (
            <Image
              className="mk-photo-img"
              src={profile.photo.src}
              alt={profile.photo.alt || name}
              width={196}
              height={196}
              sizes="196px"
              priority
            />
          ) : (
            <div className="mk-photo-img">{copy.photoPlaceholder}</div>
          )}
        </div>
        {profile.openToWork && (
          <span className="mk-status">
            <span className="mk-dot" aria-hidden="true" />
            {copy.openToWork}
          </span>
        )}
      </div>
      <dl className="mk-facts px-2">
        {profile.facts.map(({ term, value }) => (
          <div key={term} className="contents">
            <dt>{term}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
