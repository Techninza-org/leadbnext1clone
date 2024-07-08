export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return <div className="py-24 container">
        {children}
    </div>
}