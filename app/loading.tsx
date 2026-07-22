// Root-level loading.tsx -- applies to every route that doesn't define its
// own (none currently do). A generic spinner, since one shared fallback
// has to fit every page shape equally, unlike a page-specific skeleton.
//
// Note: this wraps the whole page in Suspense, including the homepage --
// its static hero content now briefly shows this instead of rendering
// instantly, trading that optimization for a single shared loading state.
const Loading = () => {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
    </div>
  );
};

export default Loading;
