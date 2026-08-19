"use client";

import { useState } from "react";
import { team, type TeamMember } from "@/data/company";
import { Reveal } from "@/components/ui/Reveal";
import { TeamPhoto } from "@/components/ui/TeamPhoto";

/**
 * About-page leadership grid.
 *
 * On touch, only one portrait is in colour at a time — selecting another
 * returns the rest to greyscale. Desktop still colourises on hover.
 */
export function TeamGrid() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="mt-16 grid grid-cols-2 items-start gap-x-gutter gap-y-12 md:grid-cols-3">
      {team.map((person, i) => (
        <Reveal key={person.id} delay={(i % 3) * 0.08}>
          <TeamCard
            person={person}
            revealed={activeId === person.id}
            onSelect={() =>
              setActiveId((current) => (current === person.id ? null : person.id))
            }
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
  person: TeamMember;
  revealed: boolean;
  onSelect: () => void;
}) {
  return (
    <article>
      <TeamPhoto
        src={person.photo}
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
