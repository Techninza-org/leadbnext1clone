import CreateOptions from "@/components/dynamic/Create-options";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function CreationPage() {
  return (
    <Card className="bg-inherit mx-auto">
      <CardHeader>
        <CardTitle className="font-bold text-3xl">Create</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4" >
        <CreateOptions />
      </CardContent>
    </Card>
  );
}
