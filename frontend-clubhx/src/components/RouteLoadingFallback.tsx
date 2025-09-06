export default function RouteLoadingFallback() {
	return (
		<div className="flex items-center justify-center h-screen bg-background">
			<div className="text-center">
				<div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary border-r-transparent align-middle" />
				<p className="mt-2 text-muted-foreground">Cargando…</p>
			</div>
		</div>
	);
}
