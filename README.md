## Important files in the project structure

```bash
src/
├── constants/
├── core/
│   ├── hooks/ # Core client components and hooks
│   ├── router/ # React router setup
│   ├── workers/ # Web workers
├── mocks/
├── pages/ # Page route components
│   ├── GridPage/
│       ├── components/
│       │   ├── Spreadsheet/
│       │       ├── Spreadsheet.tsx # AG Grid Component
├── styles/
├── types/
├── ui/ # Shared UI components
└── main.tsx # App entry point
```

## Technologies

- [React](https://react.dev/) - Frontend javascript framework in combination
  with [React Router](https://reactrouter.com/), served by [Vite](https://vite.dev/) for blazing fast local development
- [Ant Design](https://ant.design/components/overview/) - Mature UI component library for rapid prototyping
- [React AG Grid](https://www.ag-grid.com/react-data-grid/getting-started/) - Mature data grid library
- [mathjs](https://mathjs.org/) - Math library used to calculate mathematical expressions

## Setup instructions

### Option 1 - Setup via dev.sh

1. Clone the repository
2. Run `./dev.sh` in your terminal

### Option 2 - Manual Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:5173](http://localhost:5173) in your browser to access the application

## Technical decision log

- Using mathjs `evaluate` method instead of javascript's built-in `eval` which poses security concerns and offers worse
  performance.
- The dedicated Web Worker parses the formula and then sends it back to the main thread to gather the cell values which
  then get calculated in the worker. This is done to avoid gathering cell values if the formula is invalid.
- Using SharedWorker to keep the state synchronised between multiple tabs:
    - SharedWorker API offers good control over sending, receiving and handling messages as opposed to Broadcast
      ChannelAPI, but still has less overhead than Service Workers.
    - Potential future improvement could be to display a notification warning the user about duplicate tabs and tainted
      data.
    - Potential scenarios where tabs can have out of sync data:
        - The receiving tab has its main thread occupied by another intensive task and processing the message is
          delayed.
        - Delays in transferring data if the size of the data is very large.
        - Updates to the local state that are performed before the incoming message is processed if the worker's cache
          is not used as the source of truth.
        - The Shared Worker terminates due to an unhandled error or the connection to the tabs is lost.
- Future improvements:
    - Once committed, the formula for a given cell cannot be edited and has to be manually edited again, this is due to
      implementation time constraints and could be a future improvement to save and allow editing existing formulas.
    - Loading states for grid cells while intensive, long-running cell formula calculations are running in the worker,
      omitted for implementation time constraints reasons.
    - Error states for grid cells when parsing or calculating a formula fails, omitted for implementation time
      constraints reasons.
    - Use [Comlink](https://www.npmjs.com/package/comlink) to abstract worker communications
      and [TanStack Query](https://tanstack.com/query/latest) to manage asynchronous data.
