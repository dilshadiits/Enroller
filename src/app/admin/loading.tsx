export default function Loading() {
    return (
        <div className="p-8 space-y-8">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
                ))}
            </div>

            <div className="space-y-4">
                <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
        </div>
    );
}
