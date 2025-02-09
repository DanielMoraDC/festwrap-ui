import { CircleCheck } from 'lucide-react';
import Image, { StaticImageData } from 'next/image';

interface BandSearchResultProps {
  name: string;
  isActive: boolean;
  isSelected: boolean;
  handleItemSelect: (_item: any) => void;
  icon?: StaticImageData;
}

const BandSearchResult = ({
  name,
  isActive,
  isSelected,
  handleItemSelect,
  icon,
}: BandSearchResultProps) => {
  return (
    <li
      role="option"
      aria-selected={isActive}
      className={`flex items-center px-4 py-2 cursor-pointer ${isActive ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
      onClick={handleItemSelect}
    >
      {icon ? (
        <Image
          src={icon.src}
          alt=""
          width={icon.height}
          height={icon.width}
          className="h-8 w-8 rounded-md object-cover mr-2"
        />
      ) : (
        <div className="h-8 w-8 rounded-md bg-gray-200 mr-2" />
      )}
      <span>{name}</span>
      {isSelected && (
        <span className="ml-auto">
          <CircleCheck className="h-5 w-5 text-primary" />
        </span>
      )}
    </li>
  );
};

export default BandSearchResult;
