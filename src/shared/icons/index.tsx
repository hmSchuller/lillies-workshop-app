import * as React from 'react';
import Svg, {Circle, G, Path} from 'react-native-svg';
import {Colors} from '../tokens';

type IconProps = {
  color?: string;
  size?: number;
};

export function StartIcon({color = Colors.textSecondary, size = 28}: IconProps) {
  return (
    <Svg viewBox="0 0 28 28" width={size} height={size}>
      {/* V2: main body */}
      <G transform="translate(9.33,1.24) scale(1.0006,0.934)">
        <Path
          fill={color}
          stroke={color}
          strokeWidth={2.33333}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.66669 17.417L1.16669 13.667C1.78753 11.9413 2.56926 10.2871 3.50003 8.72948C4.8594 6.40071 6.75225 4.48329 8.99853 3.15959C11.2448 1.83589 13.7698 1.14994 16.3334 1.16698C16.3334 4.56698 15.4234 10.542 9.33336 14.917C7.85973 15.9154 6.29635 16.7529 4.66669 17.417Z"
        />
      </G>
      {/* V1: nozzle */}
      <G transform="translate(1.75,17.56) scale(1.0006,0.934)">
        <Path
          fill={color}
          stroke={color}
          strokeWidth={2.33333}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.50001 1.80794C1.75001 3.38294 1.16668 8.05794 1.16668 8.05794C1.16668 8.05794 5.53001 7.43294 7.00001 5.55794C7.82834 4.50794 7.81668 2.89544 6.89501 1.92044C6.44153 1.4567 5.84419 1.18874 5.21761 1.16797C4.59103 1.14721 3.97937 1.37511 3.50001 1.80794Z"
        />
      </G>
      {/* V3: left fin */}
      <G transform="translate(3.5,7.68) scale(1,0.934)">
        <Path
          fill={color}
          stroke={color}
          strokeWidth={2.33333}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.00001 6.76666H1.16668C1.16668 6.76666 1.80834 2.97916 3.50001 1.76666C5.39001 0.416657 9.33334 1.76666 9.33334 1.76666"
        />
      </G>
      {/* V4: right fin */}
      <G transform="translate(12.83,14.08) scale(1.0013,0.933)">
        <Path
          fill={color}
          stroke={color}
          strokeWidth={2.33333}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M1.16667 3.66697V9.91697C1.16667 9.91697 4.70167 9.22947 5.83333 7.41697C7.09333 5.39197 5.83333 1.16697 5.83333 1.16697"
        />
      </G>
    </Svg>
  );
}

export function CategoriesIcon({color = Colors.textSecondary, size}: IconProps) {
  return (
    <Svg
      viewBox="0 0 28 30"
      width={size ?? 28}
      height={size ? (size * 30) / 28 : 30}>
      {/* P1: roof outline */}
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2.33333}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.33333 8.75L7.47833 3.2375C7.6954 3.00354 7.95354 2.81792 8.23787 2.69135C8.5222 2.56477 8.8271 2.49974 9.135 2.5H18.865C19.1729 2.49974 19.4778 2.56477 19.7621 2.69135C20.0465 2.81792 20.3046 3.00354 20.5217 3.2375L25.6667 8.75"
      />
      {/* P2: main walls */}
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2.33333}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.66667 15V25C4.66667 25.663 4.9125 26.2989 5.35008 26.7678C5.78767 27.2366 6.38116 27.5 7 27.5H21C21.6188 27.5 22.2123 27.2366 22.6499 26.7678C23.0875 26.2989 23.3333 25.663 23.3333 25V15"
      />
      {/* P3: door */}
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2.33333}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.5 27.5V22.5C17.5 21.837 17.2542 21.2011 16.8166 20.7322C16.379 20.2634 15.7855 20 15.1667 20H12.8333C12.2145 20 11.621 20.2634 11.1834 20.7322C10.7458 21.2011 10.5 21.837 10.5 22.5V27.5"
      />
      {/* P4: horizontal eave line */}
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2.33333}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.33333 8.75H25.6667"
      />
      {/* P5: awning / scalloped bottom of roof */}
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2.33333}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M25.6667 8.75V12.5C25.6667 13.163 25.4208 13.7989 24.9832 14.2678C24.5457 14.7366 23.9522 15 23.3333 15C22.6517 14.9598 22.0007 14.6834 21.4783 14.2125C21.3391 14.1047 21.1717 14.0467 21 14.0467C20.8283 14.0467 20.6609 14.1047 20.5217 14.2125C19.9993 14.6834 19.3483 14.9598 18.6667 15C17.985 14.9598 17.334 14.6834 16.8117 14.2125C16.6725 14.1047 16.5051 14.0467 16.3333 14.0467C16.1616 14.0467 15.9942 14.1047 15.855 14.2125C15.3326 14.6834 14.6816 14.9598 14 15C13.3184 14.9598 12.6674 14.6834 12.145 14.2125C12.0058 14.1047 11.8384 14.0467 11.6667 14.0467C11.4949 14.0467 11.3275 14.1047 11.1883 14.2125C10.666 14.6834 10.015 14.9598 9.33333 15C8.65169 14.9598 8.00069 14.6834 7.47833 14.2125C7.33913 14.1047 7.17175 14.0467 7 14.0467C6.82825 14.0467 6.66087 14.1047 6.52167 14.2125C5.99932 14.6834 5.34831 14.9598 4.66667 15C4.04783 15 3.45434 14.7366 3.01675 14.2678C2.57917 13.7989 2.33333 13.163 2.33333 12.5V8.75"
      />
    </Svg>
  );
}

export function GratisIcon({color = Colors.textSecondary, size = 28}: IconProps) {
  return (
    <Svg viewBox="0 0 28 28" width={size} height={size}>
      {/* V1: staff */}
      <G transform="translate(9.33,2.41) scale(1.0006,0.934)">
        <Path
          stroke={color}
          fill="none"
          strokeWidth={2.33333}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M1.16667 19.9167V3.66668L15.1667 1.16668V17.4167"
        />
      </G>
      {/* V2a: first note circle */}
      <G transform="translate(2.33,16.41) scale(1.001,0.934)">
        <Path
          stroke={color}
          fill="none"
          strokeWidth={2.33333}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.66667 8.66667C6.59966 8.66667 8.16667 6.98773 8.16667 4.91667C8.16667 2.8456 6.59966 1.16667 4.66667 1.16667C2.73367 1.16667 1.16667 2.8456 1.16667 4.91667C1.16667 6.98773 2.73367 8.66667 4.66667 8.66667Z"
        />
      </G>
      {/* V2b: second note circle */}
      <G transform="translate(16.33,14.08) scale(1.001,0.934)">
        <Path
          stroke={color}
          fill="none"
          strokeWidth={2.33333}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.66667 8.66667C6.59966 8.66667 8.16667 6.98773 8.16667 4.91667C8.16667 2.8456 6.59966 1.16667 4.66667 1.16667C2.73367 1.16667 1.16667 2.8456 1.16667 4.91667C1.16667 6.98773 2.73367 8.66667 4.66667 8.66667Z"
        />
      </G>
    </Svg>
  );
}

export function StudioIcon({color = Colors.textSecondary, size = 28}: IconProps) {
  return (
    <Svg viewBox="0 0 28 28" width={size} height={size}>
      {/* V1: mic body */}
      <G transform="translate(9.33,1.24) scale(1.001,0.934)">
        <Path
          stroke={color}
          fill="none"
          strokeWidth={2.33333}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.66667 1.16667C3.73841 1.16667 2.84817 1.56175 2.19179 2.26502C1.53542 2.96828 1.16667 3.9221 1.16667 4.91667V13.6667C1.16667 14.6612 1.53542 15.6151 2.19179 16.3183C2.84817 17.0216 3.73841 17.4167 4.66667 17.4167C5.59492 17.4167 6.48516 17.0216 7.14154 16.3183C7.79792 15.6151 8.16667 14.6612 8.16667 13.6667V4.91667C8.16667 3.9221 7.79792 2.96828 7.14154 2.26502C6.48516 1.56175 5.59492 1.16667 4.66667 1.16667Z"
        />
      </G>
      {/* V2: U-stand */}
      <G transform="translate(4.66,10.58) scale(1.001,0.934)">
        <Path
          stroke={color}
          fill="none"
          strokeWidth={2.33333}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.5 1.16667V3.66667C17.5 5.98731 16.6396 8.21291 15.108 9.85385C13.5765 11.4948 11.4993 12.4167 9.33333 12.4167C7.1674 12.4167 5.09017 11.4948 3.55863 9.85385C2.02708 8.21291 1.16667 5.98731 1.16667 3.66667V1.16667"
        />
      </G>
      {/* V3: vertical stand line */}
      <G transform="translate(12.83,21.08) scale(1.004,0.934)">
        <Path
          stroke={color}
          fill="none"
          strokeWidth={2.33333}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M1.16667 1.16667V4.91667"
        />
      </G>
    </Svg>
  );
}

export function MeinsIcon({color = Colors.textSecondary, size = 28}: IconProps) {
  return (
    <Svg viewBox="0 0 28 28" width={size} height={size}>
      {/* V1: main hexagonal outline */}
      <G transform="translate(2.33,1.25) scale(1.0004,0.933)">
        <Path
          stroke={color}
          fill="none"
          strokeWidth={2.33333}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 25.8266C10.8547 26.046 11.2571 26.1615 11.6667 26.1615C12.0763 26.1615 12.4786 26.046 12.8333 25.8266L21 20.8266C21.3544 20.6074 21.6487 20.2922 21.8535 19.9126C22.0582 19.5331 22.1662 19.1025 22.1667 18.6641V8.6641C22.1662 8.2257 22.0582 7.79512 21.8535 7.41556C21.6487 7.036 21.3544 6.72081 21 6.5016L12.8333 1.5016C12.4786 1.28218 12.0763 1.16667 11.6667 1.16667C11.2571 1.16667 10.8547 1.28218 10.5 1.5016L2.33333 6.5016C1.97897 6.72081 1.68464 7.036 1.47987 7.41556C1.2751 7.79512 1.16709 8.2257 1.16667 8.6641V18.6641C1.16709 19.1025 1.2751 19.5331 1.47987 19.9126C1.68464 20.2922 1.97897 20.6074 2.33333 20.8266L10.5 25.8266Z"
        />
      </G>
      {/* V2: vertical center line */}
      <G transform="translate(12.83,12.91) scale(1.004,0.934)">
        <Path
          stroke={color}
          fill="none"
          strokeWidth={2.33333}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M1.16667 13.6667V1.16667"
        />
      </G>
      {/* V3: top diagonal */}
      <G transform="translate(2.67,7.08) scale(1,0.934)">
        <Path
          stroke={color}
          fill="none"
          strokeWidth={2.33333}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M1.16683 1.16683L11.3285 7.41683L21.4902 1.16683"
        />
      </G>
      {/* V4: bottom short diagonal */}
      <G transform="translate(7.58,3.89) scale(1.0008,0.934)">
        <Path
          stroke={color}
          fill="none"
          strokeWidth={2.33333}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M1.16683 1.16683L11.6668 7.60433"
        />
      </G>
    </Svg>
  );
}

export function SearchIcon({color = Colors.textPrimary, size}: IconProps) {
  return (
    <Svg viewBox="0 0 28 28" width={size ?? 28} height={size ?? 28}>
      {/* V1: lens circle */}
      <G transform="translate(2.04,2.04) scale(1,1)">
        <Path
          stroke={color}
          fill="none"
          strokeWidth={2.91667}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.7917 20.125C15.9463 20.125 20.125 15.9463 20.125 10.7917C20.125 5.63701 15.9463 1.45833 10.7917 1.45833C5.63701 1.45833 1.45833 5.63701 1.45833 10.7917C1.45833 15.9463 5.63701 20.125 10.7917 20.125Z"
        />
      </G>
      {/* V2: handle */}
      <G transform="translate(18.02,18.02) scale(1,1)">
        <Path
          stroke={color}
          fill="none"
          strokeWidth={2.91667}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.475 6.475L1.45833 1.45833"
        />
      </G>
    </Svg>
  );
}

export function CartIcon({color = Colors.textPrimary, size}: IconProps) {
  return (
    <Svg viewBox="0 0 28 28" width={size ?? 28} height={size ?? 28}>
      {/* V1: bag body */}
      <G transform="translate(2.04,0.87) scale(1,1)">
        <Path
          stroke={color}
          fill="none"
          strokeWidth={2.91667}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.95833 1.45833L1.45833 6.125V22.4583C1.45833 23.0772 1.70417 23.6707 2.14175 24.1082C2.57934 24.5458 3.17283 24.7917 3.79167 24.7917H20.125C20.7438 24.7917 21.3373 24.5458 21.7749 24.1082C22.2125 23.6707 22.4583 23.0772 22.4583 22.4583V6.125L18.9583 1.45833H4.95833Z"
        />
      </G>
      {/* V2: horizontal divider line */}
      <G transform="translate(2.04,12.54) scale(1,1)">
        <Path
          stroke={color}
          fill="none"
          strokeWidth={2.91667}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M1.45833 1.45833H22.4583"
        />
      </G>
      {/* V3: handle arch */}
      <G transform="translate(7.87,10.21) scale(1,1)">
        <Path
          stroke={color}
          fill="none"
          strokeWidth={2.91667}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.7917 1.45833C10.7917 2.69601 10.3 3.883 9.42483 4.75817C8.54966 5.63333 7.36268 6.125 6.125 6.125C4.88732 6.125 3.70034 5.63333 2.82517 4.75817C1.95 3.883 1.45833 2.69601 1.45833 1.45833"
        />
      </G>
    </Svg>
  );
}

export function ProfileIcon({color = Colors.textPrimary, size}: IconProps) {
  return (
    <Svg viewBox="0 0 28 28" width={size ?? 28} height={size ?? 28}>
      {/* V2: head circle */}
      <G transform="translate(7.87,2.04) scale(1,1)">
        <Path
          stroke={color}
          fill="none"
          strokeWidth={2.91667}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.125 10.7917C8.70233 10.7917 10.7917 8.70233 10.7917 6.125C10.7917 3.54767 8.70233 1.45833 6.125 1.45833C3.54767 1.45833 1.45833 3.54767 1.45833 6.125C1.45833 8.70233 3.54767 10.7917 6.125 10.7917Z"
        />
      </G>
      {/* V1: shoulders */}
      <G transform="translate(4.37,16.04) scale(1,1)">
        <Path
          stroke={color}
          fill="none"
          strokeWidth={2.91667}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.7917 8.45833V6.125C17.7917 4.88732 17.3 3.70034 16.4248 2.82517C15.5497 1.95 14.3627 1.45833 13.125 1.45833H6.125C4.88732 1.45833 3.70034 1.95 2.82517 2.82517C1.95 3.70034 1.45833 4.88732 1.45833 6.125V8.45833"
        />
      </G>
    </Svg>
  );
}

// ─── Category icons (24×24, white on coloured background) ──────────────────

export function BewegungIcon({color = Colors.backgroundCard, size = 24}: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 12H19.52C19.083 11.9991 18.6577 12.1413 18.3091 12.405C17.9606 12.6686 17.708 13.0392 17.59 13.46L15.24 21.82C15.2249 21.8719 15.1933 21.9175 15.15 21.95C15.1067 21.9825 15.0541 22 15 22C14.9459 22 14.8933 21.9825 14.85 21.95C14.8067 21.9175 14.7751 21.8719 14.76 21.82L9.24 2.18C9.22485 2.12807 9.19327 2.08246 9.15 2.05C9.10673 2.01754 9.05409 2 9 2C8.94591 2 8.89327 2.01754 8.85 2.05C8.80673 2.08246 8.77515 2.12807 8.76 2.18L6.41 10.54C6.29246 10.9592 6.04138 11.3285 5.69486 11.592C5.34835 11.8555 4.92532 11.9988 4.49 12H2"
      />
    </Svg>
  );
}

export function AbenteuerIcon({color = Colors.backgroundCard, size = 24}: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.24 7.76L14.436 13.171C14.3378 13.4656 14.1724 13.7333 13.9528 13.9528C13.7333 14.1724 13.4656 14.3378 13.171 14.436L7.76 16.24L9.564 10.829C9.66218 10.5344 9.82761 10.2667 10.0472 10.0472C10.2667 9.82761 10.5344 9.66218 10.829 9.564L16.24 7.76Z"
      />
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      />
    </Svg>
  );
}

export function TiereNaturIcon({color = Colors.backgroundCard, size = 24}: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 20C9.24406 20.0053 7.55025 19.3505 6.25452 18.1654C4.95878 16.9803 4.15577 15.3515 4.00474 13.6021C3.8537 11.8527 4.36569 10.1104 5.43915 8.72074C6.51261 7.33112 8.06913 6.3957 9.8 6.1C15.5 5 17 4.48 19 2C20 4 21 6.18 21 10C21 15.5 16.22 20 11 20Z"
      />
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2 21C2 18 3.85 15.64 7.08 15C9.5 14.52 12 13 13 12"
      />
    </Svg>
  );
}

export function KinderliedIcon({color = Colors.backgroundCard, size = 24}: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 18V5L21 3V16"
      />
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 21C7.65685 21 9 19.6569 9 18C9 16.3431 7.65685 15 6 15C4.34315 15 3 16.3431 3 18C3 19.6569 4.34315 21 6 21Z"
      />
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 19C19.6569 19 21 17.6569 21 16C21 14.3431 19.6569 13 18 13C16.3431 13 15 14.3431 15 16C15 17.6569 16.3431 19 18 19Z"
      />
    </Svg>
  );
}

export function DetektivIcon({color = Colors.backgroundCard, size = 24}: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
      />
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21L16.7 16.7"
      />
    </Svg>
  );
}

export function WissenLernenIcon({color = Colors.backgroundCard, size = 24}: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 7V21"
      />
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 18C2.73478 18 2.48043 17.8946 2.29289 17.7071C2.10536 17.5196 2 17.2652 2 17V4C2 3.73478 2.10536 3.48043 2.29289 3.29289C2.48043 3.10536 2.73478 3 3 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7C12 5.93913 12.4214 4.92172 13.1716 4.17157C13.9217 3.42143 14.9391 3 16 3H21C21.2652 3 21.5196 3.10536 21.7071 3.29289C21.8946 3.48043 22 3.73478 22 4V17C22 17.2652 21.8946 17.5196 21.7071 17.7071C21.5196 17.8946 21.2652 18 21 18H15C14.2044 18 13.4413 18.3161 12.8787 18.8787C12.3161 19.4413 12 20.2044 12 21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H3Z"
      />
    </Svg>
  );
}

export function MaerchenIcon({color = Colors.backgroundCard, size = 24}: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.937 15.5C9.84772 15.1539 9.66734 14.8381 9.41462 14.5854C9.1619 14.3327 8.84607 14.1523 8.5 14.063L2.365 12.481C2.26033 12.4513 2.16821 12.3883 2.10261 12.3014C2.03702 12.2146 2.00152 12.1088 2.00152 12C2.00152 11.8912 2.03702 11.7854 2.10261 11.6986C2.16821 11.6117 2.26033 11.5487 2.365 11.519L8.5 9.936C8.84595 9.84681 9.16169 9.66657 9.4144 9.41404C9.66711 9.1615 9.84757 8.84589 9.937 8.5L11.519 2.365C11.5484 2.25992 11.6114 2.16734 11.6983 2.10139C11.7853 2.03545 11.8914 1.99975 12.0005 1.99975C12.1096 1.99975 12.2157 2.03545 12.3027 2.10139C12.3896 2.16734 12.4526 2.25992 12.482 2.365L14.063 8.5C14.1523 8.84607 14.3327 9.1619 14.5854 9.41462C14.8381 9.66734 15.1539 9.84772 15.5 9.937L21.635 11.518C21.7405 11.5471 21.8335 11.61 21.8998 11.6971C21.9661 11.7841 22.002 11.8906 22.002 12C22.002 12.1094 21.9661 12.2159 21.8998 12.3029C21.8335 12.39 21.7405 12.4529 21.635 12.482L15.5 14.063C15.1539 14.1523 14.8381 14.3327 14.5854 14.5854C14.3327 14.8381 14.1523 15.1539 14.063 15.5L12.481 21.635C12.4516 21.7401 12.3886 21.8327 12.3017 21.8986C12.2147 21.9646 12.1086 22.0003 11.9995 22.0003C11.8904 22.0003 11.7843 21.9646 11.6973 21.8986C11.6104 21.8327 11.5474 21.7401 11.518 21.635L9.937 15.5Z"
      />
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 3V7"
      />
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 5H18"
      />
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 17V19"
      />
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 18H3"
      />
    </Svg>
  );
}

export function EinschlafenIcon({color = Colors.backgroundCard, size = 24}: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3C10.8065 4.19347 10.136 5.81217 10.136 7.5C10.136 9.18783 10.8065 10.8065 12 12C13.1935 13.1935 14.8122 13.864 16.5 13.864C18.1878 13.864 19.8065 13.1935 21 12C21 13.78 20.4722 15.5201 19.4832 17.0001C18.4943 18.4802 17.0887 19.6337 15.4442 20.3149C13.7996 20.9961 11.99 21.1743 10.2442 20.8271C8.49836 20.4798 6.89471 19.6226 5.63604 18.364C4.37737 17.1053 3.5202 15.5016 3.17293 13.7558C2.82567 12.01 3.0039 10.2004 3.68508 8.55585C4.36627 6.91131 5.51983 5.50571 6.99987 4.51677C8.47991 3.52784 10.22 3 12 3Z"
      />
    </Svg>
  );
}

export function FantasyMagieIcon({color = Colors.backgroundCard, size = 24}: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.64 3.64L20.36 2.36C20.2475 2.24632 20.1135 2.15607 19.9659 2.09448C19.8183 2.03289 19.66 2.00118 19.5 2.00118C19.3401 2.00118 19.1817 2.03289 19.0341 2.09448C18.8865 2.15607 18.7525 2.24632 18.64 2.36L2.36 18.64C2.24632 18.7525 2.15607 18.8865 2.09448 19.0341C2.03289 19.1817 2.00118 19.3401 2.00118 19.5C2.00118 19.66 2.03289 19.8183 2.09448 19.9659C2.15607 20.1135 2.24632 20.2475 2.36 20.36L3.64 21.64C3.75182 21.7549 3.88553 21.8462 4.03324 21.9086C4.18095 21.971 4.33966 22.0031 4.5 22.0031C4.66034 22.0031 4.81905 21.971 4.96676 21.9086C5.11447 21.8462 5.24818 21.7549 5.36 21.64L21.64 5.36C21.7549 5.24818 21.8462 5.11447 21.9086 4.96676C21.971 4.81905 22.0031 4.66034 22.0031 4.5C22.0031 4.33966 21.971 4.18095 21.9086 4.03324C21.8462 3.88553 21.7549 3.75182 21.64 3.64Z"
      />
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 7L17 10"
      />
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 6V10"
      />
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 14V18"
      />
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 2V4"
      />
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 8H3"
      />
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 16H17"
      />
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 3H9"
      />
    </Svg>
  );
}

export function PferdegeschichtenIcon({color = Colors.backgroundCard, size = 24}: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path
        stroke={color}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 14C20.49 12.54 22 10.79 22 8.5C22 7.04131 21.4205 5.64236 20.3891 4.61091C19.3576 3.57946 17.9587 3 16.5 3C14.74 3 13.5 3.5 12 5C10.5 3.5 9.26 3 7.5 3C6.04131 3 4.64236 3.57946 3.61091 4.61091C2.57946 5.64236 2 7.04131 2 8.5C2 10.8 3.5 12.55 5 14L12 21L19 14Z"
      />
    </Svg>
  );
}

export function BellIcon({color = Colors.textPrimary, size = 28}: IconProps) {
  return (
    <Svg viewBox="0 0 28 28" width={size} height={size}>
      {/* Bell body */}
      <G transform="translate(2.33, 2.33)">
        <Path
          stroke={color}
          fill="none"
          strokeWidth={2.33333}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.5 9.33C17.5 7.47 16.76 5.69 15.44 4.37C14.12 3.06 12.34 2.33 10.5 2.33C8.66 2.33 6.88 3.06 5.56 4.37C4.24 5.69 3.5 7.47 3.5 9.33C3.5 17.5 0 19.83 0 19.83H21C21 19.83 17.5 17.5 17.5 9.33Z"
        />
      </G>
      {/* Clapper */}
      <G transform="translate(2.33, 2.33)">
        <Path
          stroke={color}
          fill="none"
          strokeWidth={2.33333}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12.85 22.17C12.65 22.51 12.37 22.79 12.03 22.98C11.69 23.18 11.3 23.28 10.91 23.28C10.51 23.28 10.12 23.18 9.78 22.98C9.44 22.79 9.16 22.51 8.97 22.17"
        />
      </G>
      {/* Top knob */}
      <Circle
        cx="12.83"
        cy="3.5"
        r="1.17"
        fill={color}
      />
    </Svg>
  );
}
