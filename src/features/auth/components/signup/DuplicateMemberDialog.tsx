import AuthNoticeDialog from "@/features/auth/components/common/AuthNoticeDialog";

type DuplicateMemberDialogProps = {
  onConfirm: () => void;
};

export default function DuplicateMemberDialog({
  onConfirm,
}: DuplicateMemberDialogProps) {
  return (
    <AuthNoticeDialog
      contentPosition="lower"
      message="이미 가입된 회원입니다"
      onConfirm={onConfirm}
    />
  );
}
