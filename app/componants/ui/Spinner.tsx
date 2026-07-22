// Shared visual for loading.tsx -- kept separate from the special file
// itself so it's reusable and the special file stays a thin wrapper.
const Spinner = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
  </div>
);

export default Spinner;
