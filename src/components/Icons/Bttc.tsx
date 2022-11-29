import useTheme from 'hooks/useTheme'

function Bttc({ size = 36, color }: { size?: number; color?: string }) {
  const theme = useTheme()
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_905_1998)">
        <path
          d="M35.6306 14.378C35.3903 13.2137 35.0392 12.0864 34.5771 10.9961C34.1336 9.92419 33.5608 8.90777 32.9139 7.9283C32.2672 6.96732 31.5279 6.08026 30.7147 5.26711C29.9016 4.45397 29.0146 3.71475 28.0535 3.06794C27.0925 2.42111 26.0577 1.86669 24.9858 1.40469C23.8954 0.942675 22.768 0.591545 21.6038 0.351299C20.421 0.111053 19.2013 -0.0183105 17.9816 -0.0183105C16.7619 -0.0183105 15.5606 0.129533 14.3779 0.36978C13.2136 0.610026 12.0863 0.961156 10.9959 1.42317C9.92405 1.86669 8.90763 2.43959 7.92816 3.08641C6.96715 3.73324 6.0801 4.47244 5.26695 5.28559C4.4538 6.09872 3.71457 6.9858 3.06776 7.94678C2.42093 8.90777 1.86651 9.94268 1.4045 11.0145C0.942483 12.1049 0.591352 13.2322 0.351104 14.3965C0.110855 15.5792 -0.0185089 16.7989 -0.0185089 18.0186C-0.0185089 19.2384 0.110855 20.4581 0.351104 21.6409C0.591352 22.8051 0.942483 23.9325 1.4045 25.0227C1.84803 26.0946 2.42093 27.1111 3.06776 28.0905C3.71457 29.0515 4.4538 29.9385 5.26695 30.7518C6.0801 31.5648 6.96715 32.3041 7.92816 32.9508C8.88914 33.5978 9.92405 34.1522 10.9959 34.6142C12.0863 35.0761 13.2136 35.4273 14.3779 35.6676C15.5606 35.9077 16.7804 36.0371 18 36.0371C19.2199 36.0371 20.4395 35.9077 21.6223 35.6676C22.7866 35.4273 23.9139 35.0761 25.0042 34.6142C26.0761 34.1705 27.0925 33.5978 28.0721 32.9508C29.0329 32.3041 29.9201 31.5648 30.7332 30.7518C31.5464 29.9385 32.2855 29.0515 32.9324 28.0905C33.5792 27.1295 34.1336 26.0946 34.5956 25.0227C35.0577 23.9325 35.4089 22.8051 35.649 21.6409C35.8893 20.4581 36.0187 19.2384 36.0187 18.0186C36.0002 16.7805 35.8708 15.5607 35.6306 14.378ZM18 33.7455C9.29571 33.7455 2.25461 26.6859 2.25461 18.0002C2.25461 9.31433 9.31419 2.25479 18 2.25479C26.6859 2.25479 33.7455 9.31433 33.7455 18.0002C33.7455 26.7045 26.7044 33.7455 18 33.7455Z"
          fill={theme.text}
        />
        <path
          d="M18.2772 32.3962H18.7022C18.7762 32.3962 18.8501 32.3962 18.9239 32.3778H18.9425C19.0165 32.3778 19.0719 32.3778 19.1457 32.3593H19.2011C19.2566 32.3593 19.312 32.3593 19.3675 32.3407H19.4229C19.4783 32.3407 19.5338 32.3224 19.6078 32.3224H19.6447C19.7186 32.3224 19.7926 32.3039 19.8664 32.3039C19.9404 32.3039 19.9958 32.2853 20.0698 32.267H20.1067C20.1622 32.267 20.2176 32.2484 20.273 32.2484H20.3099C20.3839 32.2299 20.4394 32.2299 20.5133 32.2115C20.6611 32.193 20.8091 32.1561 20.9383 32.119H20.9754C21.0308 32.1006 21.1046 32.1006 21.1601 32.0821H21.1786C21.3264 32.0452 21.4558 32.0081 21.6036 31.9712C19.8295 32.0266 18.3881 31.7864 17.4825 31.5831C15.4497 31.1396 13.5092 30.3449 11.8645 28.9774C9.12933 26.6859 7.72481 23.3964 7.76178 20.1252C7.78025 17.6859 8.61189 15.2465 10.2936 13.2506C12.4004 10.7558 15.3942 9.44367 18.4621 9.36976H18.887V6.91187H18.4066C17.464 6.93035 16.54 7.04123 15.6345 7.24452C14.7104 7.4478 13.8234 7.76197 12.9733 8.15005C12.1047 8.55661 11.2915 9.05559 10.5339 9.62848C9.75768 10.2199 9.03694 10.9036 8.40859 11.6613C7.81722 12.3636 7.29976 13.1213 6.87471 13.9344C6.44965 14.7106 6.11701 15.5422 5.85828 16.3923C5.61804 17.2239 5.43323 18.0925 5.3593 18.961C5.34084 19.2382 5.32235 19.497 5.30386 19.7742V20.2547C5.32235 21.1971 5.43323 22.1213 5.63652 23.0266C5.83981 23.9508 6.15397 24.8378 6.54207 25.688C7.00407 26.7042 7.83569 28.2013 9.07389 29.3285C11.5133 31.2505 14.5996 32.3962 17.9445 32.3962H18.2772Z"
          fill={theme.text}
        />
        <path
          d="M22.306 30.0124C21.4558 29.9939 20.4025 29.8646 19.5894 29.7167C15.7823 29.0329 12.5113 26.7044 11.3101 23.1931C9.8501 18.9241 12.0862 14.3038 16.3367 12.8993C17.1684 12.6221 18 12.4927 18.8501 12.4927C19.9404 12.4927 21.0308 12.7145 22.0288 13.1211L23.0636 10.9219C22.7495 10.7925 22.4354 10.6816 22.1211 10.5708C21.0677 10.2381 19.9589 10.0718 18.8501 10.0718C17.7413 10.0718 16.6324 10.2566 15.5791 10.6077C14.23 11.0512 12.9918 11.772 11.9384 12.7145C11.4394 13.1581 10.9589 13.6755 10.5524 14.2115C10.1458 14.7474 9.79466 15.3203 9.49898 15.9301C9.20327 16.54 8.96303 17.1683 8.79671 17.8152C8.63039 18.462 8.50102 19.1458 8.46407 19.8296C8.37166 21.2342 8.55646 22.6385 9.01847 23.9693C9.48049 25.3184 10.2197 26.5566 11.2361 27.6469C12.1417 28.6264 13.1951 29.3657 14.4702 30.0493C15.8008 30.7517 17.4456 31.1212 19.1642 31.3615C20.273 31.5093 21.7516 31.5464 22.6201 31.5464C23.3779 31.2692 23.692 31.1398 24.0986 30.9734C24.4498 30.8071 24.8008 30.6408 25.1519 30.4374C25.5031 30.2342 25.5586 30.1973 26.1499 29.8092C26.2053 29.7721 26.2607 29.7352 26.2978 29.6983C24.2649 30.0679 23.7474 30.0493 22.306 30.0124Z"
          fill={color || theme.text}
        />
        <path
          d="M26.8522 27.2775C26.2793 27.3144 25.466 27.3698 24.5421 27.3698C22.8973 27.3698 20.8829 27.222 19.1642 26.6491C16.503 25.7621 13.9896 23.489 13.9896 20.6799C13.9896 17.8708 16.2627 15.6161 19.0534 15.6161C20.9569 15.6161 22.6015 16.6695 23.4702 18.2035L25.6694 17.1131C25.3183 16.4663 24.8933 15.8749 24.3572 15.3574C23.6734 14.6736 22.8604 14.1192 21.9733 13.7496C21.0492 13.3615 20.0698 13.1582 19.0534 13.1582C18.0369 13.1582 17.0574 13.3615 16.1334 13.7496C15.2463 14.1192 14.4332 14.6736 13.7494 15.3574C13.0656 16.0412 12.5112 16.8543 12.1416 17.7414C11.7535 18.6654 11.5502 19.6449 11.5502 20.6614C11.5502 21.6779 11.772 22.6943 12.197 23.6553C12.5851 24.5053 13.121 25.3 13.8048 26.0393C15.0061 27.3329 16.6508 28.3679 18.4064 28.9592C20.0882 29.5136 22.5646 29.717 24.9671 29.5507C25.6324 29.5136 26.1313 29.4398 26.9815 29.255C27.7947 28.608 28.5523 27.869 29.1992 27.0557C28.6448 27.1112 27.5913 27.222 26.8522 27.2775Z"
          fill={color || theme.text}
        />
      </g>
      <defs>
        <clipPath id="clip0_905_1998">
          <rect width="36" height="36" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default Bttc
