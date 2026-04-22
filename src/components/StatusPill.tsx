import Box from "@mui/material/Box";
import type { StudyStatusMap } from "@/types";

type StatusPillProps = { status: number; map: StudyStatusMap };

function StatusPill({ status, map }: StatusPillProps) {
  const { color, text } = map[status];

  return (
    <Box
      component="span"
      sx={(theme) => ({
        backgroundColor: theme.palette[color].dark,
        borderRadius: "9999px",
        color: "#ffffff",
        px: 2,
        py: 0.5,
        textAlign: "center",
        display: "inline-block",
        minWidth: "100px",
      })}
    >
      {text}
    </Box>
  );
}
export default StatusPill;
