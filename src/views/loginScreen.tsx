// apps/lynx-mobile/src/views/loginScreen.tsx
export function LoginScreen({ onBack }: { onBack: () => void }) {
    return (
        <view className="LoginScreen">
            <text className="Title">Login</text>

            <input
                type="email"
                placeholder="Enter your email"
                className="Input"
            />

            <input
                type="password"
                placeholder="Enter your password"
                className="Input"
            />

            {/* Replace <button> with <view> */}
            <view className="LoginButton">
                <text className="ButtonText">Login</text>
            </view>

            {/* Back Button (Fixed) */}
            <view className="BackButton" bindtap={onBack}>
                <text className="ButtonText">Back</text>
            </view>
        </view>
    )
}