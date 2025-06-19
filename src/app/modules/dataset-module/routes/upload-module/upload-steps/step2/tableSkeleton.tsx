export default function TableSkeleton() {
  return (
    <div
      css={`
        border-radius: 10px;
        border: 0.5px solid var(--Secondary-Grey-grey-5, #adb5bd);
        background: var(--Secondary-White-1, #fff);
      `}
    >
      <style>
        {`
          @keyframes shimmer {
            0% {
              background-position: -200px 0;
            }
            100% {
              background-position: 200px 0;
            }
          }
            .skeleton-shimmer-header {
            background: #adb5bd;
            background-image: linear-gradient(
              90deg,
              #adb5bd 0px,
              #ced4da 40px,
              #adb5bd 80px
            );
            }
             .skeleton-shimmer-body {
            background: #dfe3e5;
            background-image: linear-gradient(
              90deg,
              #dfe3e5 0px,
              #f0f0f0 40px,
              #dfe3e5 80px
            );
        }
          .skeleton-shimmer {
            background-size: 200px 100%;
            background-repeat: no-repeat;
            animation: shimmer 1.6s infinite linear;
          }

            .skeleton-shimmer-bar {
            background: #dfe3e5;
            background-image: linear-gradient(
              90deg,
              #dfe3e5 0px,
              #f8f9fa 40px,
              #dfe3e5 80px
            );
            background-size: 400px 100%;
            background-repeat: no-repeat;
            animation: shimmer 1.5s infinite linear;
          }
        `}
      </style>
      {/* header */}
      <div
        className="skeleton-shimmer-bar"
        css={`
          border: 1px solid #dfe3e5;
          background: #dfe3e5;
          border-radius: 10px 10px 0 0;
          display: flex;
          height: 48px;
          padding: 16px 20px;
        `}
      >
        {/* header cells */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            css={`
              display: flex;
              width: 205px;
              align-items: center;
            `}
          >
            <div
              className="skeleton-shimmer skeleton-shimmer-header"
              css={`
                background: #98a1aa;
                height: 8px;
                width: 88px;
              `}
            />
          </div>
        ))}
      </div>
      {/* rows */}
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          css={`
            border-bottom: ${index === 9 ? "none" : "1px solid #dfe3e5"};
            border-radius: ${index === 9 ? "0 0 10px 10px" : "0"};
            background: #fff;
            padding: 16px 20px;
            display: flex;
          `}
        >
          {/* row cells */}
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              css={`
                display: flex;
                width: 205px;
                align-items: center;
              `}
            >
              <div
                className="skeleton-shimmer skeleton-shimmer-body"
                css={`
                  background: #dfe3e5;
                  height: 8px;
                  width: 64px;
                `}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
