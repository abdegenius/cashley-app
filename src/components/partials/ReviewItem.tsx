export const ReviewItem = ({ label, value }: { label: string; value: string }) => {
    return (
        <div className="flex justify-between items-center py-2 text-sm border-b border-zinc-800/20 last:border-0">
            <span className="opacity-80">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}
