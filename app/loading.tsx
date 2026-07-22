// Root-level loading.tsx -- applies to every route that doesn't define its
// own (none currently do).
//
// Note: this wraps the whole page in Suspense, including the homepage --
// its static hero content now briefly shows this instead of rendering
// instantly, trading that optimization for a single shared loading state.
import Spinner from "@/app/componants/ui/Spinner";

const Loading = () => <Spinner />;

export default Loading;
