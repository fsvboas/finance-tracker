import { Info } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const UserPinFormDialogDrawerTooltip = () => {
  const [openTooltip, setOpenTooltip] = useState<boolean>(false);

  return (
    <Tooltip open={openTooltip} onOpenChange={setOpenTooltip}>
      <TooltipTrigger asChild>
        <Button
          type="button"
          className="bg-transparent shadow-none text-primary hover:bg-transparent !p-0 h-fit"
          onClick={() => setOpenTooltip(!openTooltip)}
          onMouseEnter={() => setOpenTooltip(true)}
          onMouseLeave={() => setOpenTooltip(false)}
          onTouchStart={() => setOpenTooltip(!openTooltip)}
          onKeyDown={(event) => {
            event.preventDefault();
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            event.key === "Enter" && setOpenTooltip(!openTooltip);
          }}
        >
          <Info size={16} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          O PIN garante que suas transações sejam <br /> protegidas por
          criptografia.
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export default UserPinFormDialogDrawerTooltip;
