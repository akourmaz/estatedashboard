This is a Next.js dashboard for working with real-estate inventory imported from Excel.

## Data Source

The repository-owned catalog lives in `src/data/catalog/`.

- `properties.raw.json` contains the full aggregated dataset imported from `../start-data/newdata.xlsx`
- `metadata.json` stores import metadata
- `index.ts` is the app-facing entry point used by the dashboard store
- `../start-data/thetable.xlsx` is preserved as a separate primary raw source for research and field inventory
- `../start-data/raw-thetable/thetable.raw.json` stores a full worksheet snapshot of `thetable.xlsx` with all rows, columns, display values, raw values, and hyperlink targets

To regenerate the catalog from Excel, run:

```bash
npm run data:extract
```

To export the raw snapshot of `thetable.xlsx`, run:

```bash
npm run data:export-thetable
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
