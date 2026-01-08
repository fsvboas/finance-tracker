import Row from "@/src/components/core/row";

interface BadgeProps {
  text?: string;
}

const Badge = ({ text = "Em breve" }: BadgeProps) => {
  return (
    <Row className="rounded-full bg-primary p-2.5 h-2 w-fit items-center">
      <span className="text-secondary text-xs">{text}</span>
    </Row>
  );
};

export default Badge;
