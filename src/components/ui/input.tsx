import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Input = React.forwardRef<HTMLTextAreaElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [height, setHeight] = React.useState("44px");
    const [overflow, setOverflow] = React.useState<"hidden" | "auto">("hidden");

    const maxHeight = "150px";

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;

      // Nếu không có văn bản, đặt chiều cao lại về 44px
      if (text.length === 0) {
        setHeight("44px");
        setOverflow("hidden");  // Ẩn thanh cuộn khi không có văn bản
      } else {
        // Tính chiều cao mới khi có văn bản
        setHeight("44px");

        const newHeight = Math.min(e.target.scrollHeight, parseInt(maxHeight));

        // Cập nhật chiều cao của textarea
        setHeight(`${newHeight}px`);

        // Kiểm tra và hiển thị thanh cuộn khi vượt quá maxHeight
        if (newHeight >= parseInt(maxHeight)) {
          setOverflow("auto");  // Hiển thị thanh cuộn khi đạt đến maxHeight
        } else {
          setOverflow("hidden");  // Không hiển thị thanh cuộn khi chưa vượt quá maxHeight
        }
      }
    };

    return (
      <textarea
        ref={ref}
        {...props}
        onInput={handleInput}
        style={{ height, overflowY: overflow }}  // Điều chỉnh overflowY động
        className={cn(
          "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
