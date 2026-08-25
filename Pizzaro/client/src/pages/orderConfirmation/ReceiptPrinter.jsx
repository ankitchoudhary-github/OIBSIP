import {
  CheckCircle,
  CircleNotch,
} from "@phosphor-icons/react";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

import {
  createContext,
  useContext,
} from "react";

const ReceiptPrinterContext = createContext(null);
const easeOut = [0.23, 1, 0.32, 1];
const easeInOut = [0.77, 0, 0.175, 1];
const receiptToothCount = 40;
const receiptToothDepth = 4;
const receiptToothPoints = Array.from(
  { length: receiptToothCount * 2 },
  (_, index) => {
    const x =
      100 -
      ((index + 1) * 100) /
      (receiptToothCount * 2);
    const y =
      index % 2 === 0
        ? "100%"
        : `calc(100% - ${receiptToothDepth}px)`;

    return `${x}% ${y}`;
  },
).join(", ");

const receiptClipPath = `polygon(
  0 0,
  100% 0,
  100% calc(100% - ${receiptToothDepth}px),
  ${receiptToothPoints}
)`;

const printingTransformKeyframes = [
  "translateY(calc(-100% + 2px))",
  "translateY(-91%)",
  "translateY(-91%)",
  "translateY(-81%)",
  "translateY(-81%)",
  "translateY(-70%)",
  "translateY(-70%)",
  "translateY(-58%)",
  "translateY(-58%)",
  "translateY(-45%)",
  "translateY(-45%)",
  "translateY(-32%)",
  "translateY(-32%)",
  "translateY(-20%)",
  "translateY(-20%)",
  "translateY(-10%)",
  "translateY(-10%)",
  "translateY(-3%)",
  "translateY(-3%)",
  "translateY(0%)",
];

const printingKeyframeTimes = [
  0,
  0.075,
  0.105,
  0.18,
  0.21,
  0.285,
  0.315,
  0.39,
  0.42,
  0.495,
  0.525,
  0.6,
  0.63,
  0.705,
  0.735,
  0.81,
  0.84,
  0.915,
  0.945,
  1,
];

const statusLabels = {
  processing: "Processing your order",
  printing: "Printing your receipt",
  complete: "Order complete",
};

function useReceiptPrinter(component) {
  const context = useContext(
    ReceiptPrinterContext,
  );

  if (!context) {
    throw new Error(
      `${component} must be used inside ReceiptPrinter.Root.`,
    );
  }

  return context;
}

function ReceiptPrinterRoot({
  children,
  animate = true,
  feedMotion = "stepped",
  stage,
  className = "",
  ...props
}) {
  const shouldReduceMotion =
    useReducedMotion();

  const context = {
    animate,
    feedMotion,
    shouldMove:
      animate && !shouldReduceMotion,
    stage,
  };

  return (
    <ReceiptPrinterContext.Provider
      value={context}
    >
      <section
        aria-label="Order receipt"
        className={`relative mx-auto flex w-full max-w-sm flex-col items-center ${className}`}
        data-stage={stage}
        {...props}
      >
        {children}
      </section>
    </ReceiptPrinterContext.Provider>
  );
}

function ReceiptPrinterMachine({
  children,
  className = "",
  ...props
}) {
  return (
    <div
      className={`relative isolate w-full overflow-hidden rounded-3xl border border-black/10 bg-[#272727] p-3 pb-8 shadow-[0_20px_36px_-20px_rgba(0,0,0,0.45),0_6px_14px_-8px_rgba(0,0,0,0.25)] ${className}`}
      {...props}
    >
      {children}
      <div
        aria-hidden="true"
        className="absolute inset-x-6 bottom-3 z-40 h-2 rounded bg-black/70"
      />
    </div>
  );
}

function ReceiptPrinterHeader({
  children,
  className = "",
  ...props
}) {
  return (
    <div
      className={`relative z-10 flex h-11 items-center justify-between ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function ReceiptPrinterScreen({
  children,
  className = "",
  ...props
}) {
  return (
    <div
      className={`relative z-10 overflow-hidden rounded-2xl border border-white/5 bg-[#191919] p-4 text-white shadow-inner ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function StatusIndicator({
  animate,
  move,
  stage,
}) {
  const isComplete =
    stage === "complete";

  return (
    <span className="relative grid size-5 shrink-0 place-items-center">
      <AnimatePresence
        initial={false}
        mode="sync"
      >
        {isComplete ? (
          <motion.span
            key="complete"
            initial={{
              opacity: animate ? 0 : 1,
              scale: move ? 0.94 : 1,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: animate ? 0 : 1,
              scale: move ? 0.96 : 1,
            }}
            transition={{
              duration: animate ? 0.16 : 0,
              ease: easeOut,
            }}
            className="col-start-1 row-start-1 text-emerald-400"
          >
            <CheckCircle
              size={18}
              weight="fill"
            />
          </motion.span>
        ) : (
          <motion.span
            key="working"
            initial={{
              opacity: animate ? 0 : 1,
              scale: move ? 0.94 : 1,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: animate ? 0 : 1,
              scale: move ? 0.96 : 1,
            }}
            transition={{
              duration: animate ? 0.16 : 0,
              ease: easeOut,
            }}
            className="col-start-1 row-start-1 text-white/50"
          >
            <CircleNotch
              size={18}
              weight="bold"
              className={
                animate
                  ? "animate-spin"
                  : ""
              }
            />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function ReceiptPrinterStatus({
  children,
  className = "",
  ...props
}) {
  const {
    animate,
    shouldMove,
    stage,
  } = useReceiptPrinter(
    "ReceiptPrinter.Status",
  );

  return (
    <div
      className={`flex min-w-0 items-center gap-2 ${className}`}
      {...props}
    >
      <StatusIndicator
        animate={animate}
        move={shouldMove}
        stage={stage}
      />
      <div
        className="grid min-w-0 flex-1 items-center"
        aria-live="polite"
        role="status"
      >
        <AnimatePresence
          initial={false}
          mode="sync"
        >
          <motion.div
            key={stage}
            initial={{
              opacity: animate ? 0 : 1,
              y: shouldMove ? 4 : 0,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: animate ? 0 : 1,
              y: shouldMove ? -4 : 0,
            }}
            transition={{
              duration: animate ? 0.18 : 0,
              ease: easeOut,
            }}
            className="truncate text-xs font-medium leading-none text-white/65"
          >
            {children ??
              statusLabels[stage]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ReceiptPrinterPaper({
  children,
  className = "",
  style,
  ...props
}) {
  return (
    <article
      className={`relative z-10 min-h-0 bg-[#fffdf9] px-6 pt-7 pb-6 font-mono text-[#171717] ${className}`}
      style={{
        clipPath: receiptClipPath,
        ...style,
      }}
      {...props}
    >
      {children}
    </article>
  );
}

function ReceiptPrinterOutput({
  children,
  className = "",
  ...props
}) {
  const {
    animate,
    feedMotion,
    shouldMove,
    stage,
  } = useReceiptPrinter(
    "ReceiptPrinter.Output",
  );

  const isReceiptVisible =
    stage !== "processing";

  const shouldUseSteppedFeed =
    feedMotion === "stepped" &&
    stage === "printing" &&
    shouldMove;

  return (
    <div
      className={`relative z-50 -mt-4 h-auto max-h-[70vh] w-[calc(80%+3rem)] max-w-full overflow-hidden px-6 ${className}`}
      {...props}
    >
      {isReceiptVisible ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 -top-1 z-20 h-2 bg-black/30 blur-[6px]"
        />
      ) : null}

      <motion.div
        initial={false}
        animate={{
          opacity: isReceiptVisible ? 1 : 0,
          transform:
            stage === "printing" &&
            shouldMove
              ? shouldUseSteppedFeed
                ? printingTransformKeyframes
                : "translateY(0%)"
              : isReceiptVisible || !shouldMove
                ? "translateY(0%)"
                : "translateY(calc(-100% + 2px))",
        }}
        transition={{
          opacity: {
            duration: animate ? 0.16 : 0,
            ease: easeOut,
          },
          transform: {
            duration: shouldMove ? 3.5 : 0,
            ease: shouldUseSteppedFeed
              ? "linear"
              : easeInOut,
            times: shouldUseSteppedFeed
              ? printingKeyframeTimes
              : undefined,
          },
        }}
        className="relative isolate before:pointer-events-none before:absolute before:inset-x-3 before:top-3 before:bottom-4 before:z-0 before:rounded-sm before:shadow-[0_8px_24px_rgba(0,0,0,0.24)] before:content-[''] after:pointer-events-none after:absolute after:right-[8%] after:bottom-0 after:left-[8%] after:z-0 after:h-3 after:translate-y-1.5 after:rounded-full after:bg-black/10 after:blur-lg after:content-['']"
      >
        {children}
      </motion.div>
    </div>
  );
}

export const ReceiptPrinter = {
  Root: ReceiptPrinterRoot,
  Machine: ReceiptPrinterMachine,
  Header: ReceiptPrinterHeader,
  Screen: ReceiptPrinterScreen,
  Status: ReceiptPrinterStatus,
  Output: ReceiptPrinterOutput,
  Paper: ReceiptPrinterPaper,
};