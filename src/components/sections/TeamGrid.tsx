"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { TeamPhoto } from "@/components/ui/TeamPhoto";
import type { ImageValue } from "@/content/fields";

export type TeamGridMember = {
  name: string;
  role: string;
  /** Shown under the role — what they actually do day to day. */
  focus: string;
  /** Empty `src` renders a monogram placeholder. */
  photo: ImageValue;
};

/**
 * About-page leadership grid. Members come from Admin → Company → Team.
 *
 * On touch, only one portrait is in colour at a time — selecting another
 * returns the rest to greyscale. Desktop still colourises on hover.
 */
export function TeamGrid({ members }: { members: TeamGridMember[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="mt-16 grid grid-cols-2 items-start gap-x-gutter gap-y-12 md:grid-cols-3">
      {members.map((person, i) => (
        <Reveal key={`${i}-${person.name}`} delay={(i % 3) * 0.08}>
          <TeamCard
            person={person}
            revealed={activeIndex === i}
            onSelect={() => setActiveIndex((current) => (current === i ? null : i))}
          />
        </Reveal>
      ))}
    </div>
  );
}

function TeamCard({
  person,
  revealed,
  onSelect,
}: {
  person: TeamGridMember;
  revealed: boolean;
  onSelect: () => void;
}) {
  return (
    <article>
      <TeamPhoto
        src={person.photo.src || null}
        name={person.name}
        role={person.role}
        revealed={revealed}
        onSelect={onSelect}
      />
      <h3 className="mt-5 font-body-lg text-body-lg leading-tight text-balance text-primary">
        {person.name}
      </h3>
      <p className="mt-2 font-label-caps text-label-caps text-muted-azure">
        {person.role}
      </p>
      <p className="mt-2 font-body-md text-body-md leading-snug text-pretty text-on-surface-variant">
        {person.focus}
      </p>
    </article>
  );
}
