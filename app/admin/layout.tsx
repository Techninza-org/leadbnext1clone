import { NavigationBar } from "@/components/navigation/navigation-bar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <NavigationBar>
            <main>{children}</main>
        </NavigationBar>
    )
}