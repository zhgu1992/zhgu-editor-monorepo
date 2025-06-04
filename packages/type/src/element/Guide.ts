interface IGuide {
  id: string;
  offset: number;
  direction: 'x' | 'y';
  isLocked: boolean;
}

interface IGuideProps {
  guide: IGuide[];
}

export { IGuide, IGuideProps };
