export default function Container(props: { children: React.ReactNode; className?: string }) {
  return (
    <div className={"mx-auto w-full max-w-6xl px-4 " + (props.className ?? "")}>
      {props.children}
    </div>
  );
}
