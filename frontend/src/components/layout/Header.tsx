interface HeaderProps {
  title: string;
  text: string;
}

export default function Header({ title, text }: HeaderProps) {
  return (
    <div className="site-baslik-content">
      <h1>{title}</h1>
      <p>{text}</p>
    </div>
  );
}
