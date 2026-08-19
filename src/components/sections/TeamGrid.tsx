"use client";

import { team, type TeamMember } from "@/data/company";
import { Reveal } from "@/components/ui/Reveal";
import { TeamPhoto } from "@/components/ui/TeamPhoto";

/**
 * About-page leadership grid.
 *
 * Name, role, and the one-line "what they do" are always on the page — the
 * previous hover/click swap hid that copy. Clicking the portrait still
 * colourises it (TeamPhoto); it is not the only way to read the bio.
 */
export function TeamGrid() {
  return (
    <div className="mt-16 grid grid-cols-2 items-start gap-x-gutter gap-y-12 md:grid-cols-3">
      {team.map((person, i) => (
        <Reveal key={person.id} delay={(i % 3) * 0.08}>
          <TeamCard person={person} />
        </Reveal>
      ))}
    </div>
  );
}

function TeamCard({ person }: { person: TeamMember }) {
  return (
    <article>
      <TeamPhoto src={person.photo} name={person.name} role={person.role} />
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
