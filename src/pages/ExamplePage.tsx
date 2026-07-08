import GrandParent from "../components/contextExample/GrandParent";
import { ExampleProvider } from "../providers/ExampleProvider";

function ExamplePage() {
  return (
    <div>
      <ExampleProvider>
        <GrandParent />
      </ExampleProvider>
    </div>
  );
}

export default ExamplePage;
