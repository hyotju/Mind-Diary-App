import { Suspense } from "react";

import FeedbackScreen, {
  LoadingFlameIcon,
} from "@/components/common/FeedbackScreen";
import OAuthCallbackScreen from "@/features/auth/components/oauth/OAuthCallbackScreen";

export default function Page() {
  return (
    <Suspense fallback={<OAuthLoadingScreen />}>
      <OAuthCallbackScreen />
    </Suspense>
  );
}

function OAuthLoadingScreen() {
  return (
    <FeedbackScreen
      description="인증 정보를 확인하고 있어요."
      icon={<LoadingFlameIcon />}
      title="Google 로그인 중"
      topClassName="top-[317px]"
    />
  );
}
