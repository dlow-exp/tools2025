# Agent Conventions

## Adding a New Tool

After implementing a new tool/calculator, always add it to the front page (`app/page.tsx`):

1. Import any needed icon from `lucide-react` (add to the existing import line).
2. Add a new entry to the `calculators` array with:
   - `name`: Display name
   - `description`: One-sentence description of what the tool does
   - `icon`: A lucide-react icon JSX element (`<IconName className="w-8 h-8" />`)
   - `href`: Route to the tool (e.g. `/calculator/my-tool`)
   - `features`: Array of 3 short feature labels shown as badges
3. The card will render automatically — no other changes needed to the page.
