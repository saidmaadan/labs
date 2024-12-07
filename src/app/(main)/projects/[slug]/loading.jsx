export default function Loading() {
  return (
    <div className="py-24 sm:py-32">
      <div className="container-center">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-1/3 bg-muted rounded"></div>
          <div className="h-12 w-2/3 bg-muted rounded"></div>
          <div className="h-96 w-full bg-muted rounded"></div>
          <div className="space-y-4">
            <div className="h-4 w-full bg-muted rounded"></div>
            <div className="h-4 w-5/6 bg-muted rounded"></div>
            <div className="h-4 w-4/6 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
