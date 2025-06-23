import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AttendanceData {
  date: string;
  present: number;
  early: number;
  late: number;
  shortDay: number;
  leave: number;
}

interface LegendItem {
  label: string;
  color: string;
}


interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownButtonProps {
  value: string;
  onValueChange: (value: string) => void;
  options: DropdownOption[];
  className?: string;
}

type AttendanceType = 'present' | 'early' | 'late' | 'shortDay' | 'leave';

const AttendanceSummaryDisplay: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('Select Employee');
  const [workHours, setWorkHours] = useState<string>('Total Work Hours');
  const [period, setPeriod] = useState<string>('Previous 10 Days');
  const [currentMonth, setCurrentMonth] = useState<string>('Current Month');

  // Generate 30 days of attendance data with weekend pattern
  const generateAttendanceData = (): AttendanceData[] => {
    const data: AttendanceData[] = [];
    
    for (let i = 0; i < 30; i++) {
      const dayNumber = i + 1;
      const date = `01/${dayNumber.toString().padStart(2, '0')}`;
      
      // Check if this is a weekend (after every 5 working days, 2 weekend days)
      const positionInWeek = i % 7;
      const isWeekend = positionInWeek === 5 || positionInWeek === 6;
      
      if (isWeekend) {
        // Weekend - show as 01/08 for both weekend days and all zeros
        data.push({
          date: '01/08',
          present: 0,
          early: 0,
          late: 0,
          shortDay: 0,
          leave: 0
        });
      } else {
        // Working day - random attendance data
        const attendanceTypes = ['present', 'early', 'late', 'shortDay', 'leave'];
        const randomType = attendanceTypes[Math.floor(Math.random() * attendanceTypes.length)];
        const randomValue = Math.floor(Math.random() * 9) + 1; // 1-9
        
        const dayData: AttendanceData = {
          date: date,
          present: 0,
          early: 0,
          late: 0,
          shortDay: 0,
          leave: 0
        };
        
        dayData[randomType as AttendanceType] = randomValue;
        data.push(dayData);
      }
    }
    
    return data;
  };

  const attendanceData: AttendanceData[] = generateAttendanceData();

  const legendItems: LegendItem[] = [
    { label: 'Present', color: '#70B0FC' },
    { label: 'Early', color: '#2AA68D' },
    { label: 'Late', color: '#ED2626' },
    { label: 'Short Day', color: '#FFB325' },
    { label: 'Leave', color: '#A83885' },
  ];  

  // Y-axis time labels
  const timeLabels: string[] = ['11:00', '08:00', '07:00', '06:00', '05:00', '01:00'];

  const maxValue: number = 10; // Based on the screenshot scale

  const getBarHeight = (value: number): number => {
    if (value === 0) return 4;
    return Math.max(12, (value / maxValue) * 140);
  };

  const getBarColor = (type: AttendanceType): string => {
    switch (type) {
      case 'present': return 'bg-blue-500';
      case 'early': return 'bg-green-600';
      case 'late': return 'bg-red-500';
      case 'shortDay': return 'bg-orange-500';
      case 'leave': return 'bg-purple-500';
      default: return 'bg-gray-800';
    }
  };

  const renderBar = (data: AttendanceData, index: number): React.ReactElement | React.ReactElement[] => {
    const types: AttendanceType[] = ['present', 'early', 'late', 'shortDay', 'leave'];
    const activeBars = types.filter(type => data[type] > 0);
    
    // Check if this is a weekend (01/08 date indicates weekend)
    const isWeekend = data.date === '01/08';
    
    if (activeBars.length === 0 || isWeekend) {
      return (
        <div
          key={`${index}-empty`}
          className={isWeekend ? "bg-black" : "bg-gray-800"}
          style={{
            height: isWeekend ? '12px' : '6px',
            width: '14px'
          }}
        />
      );
    }

    return activeBars.map((type, barIndex) => (
      <div
        key={`${index}-${type}`}
        style={{
          backgroundColor: getBarColor(type),
          height: `${getBarHeight(data[type])}px`,
          width: '17px',
          minHeight: '12px',
          marginRight: barIndex < activeBars.length - 1 ? '4px' : '0',
          borderRadius: '2px'
        }}
      />
    ));    
  };

  const DropdownButton: React.FC<DropdownButtonProps> = ({ 
    value, 
    onValueChange, 
    options, 
    className = "" 
  }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <Button 
        variant="outline" 
        className={`h-8 text-[10px] font-normal text-gray-700 bg-white border border-[0.5px] border-[#454545] rounded-[10px] hover:bg-gray-50 justify-between ${className}`}
      >
        {value}
        <div className="ml-2 w-[9px] h-[6px] relative">
          <Image
            src="/icons/dropdown.png"
            alt="Dropdown Icon"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {options.map((option) => (
          <DropdownMenuItem 
            key={option.value} 
            onClick={() => onValueChange(option.label)}
            className="cursor-pointer"
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
  

  const employeeOptions: DropdownOption[] = [
    { value: 'all', label: 'Select Employee' },
    { value: 'john', label: 'John Doe' },
    { value: 'jane', label: 'Jane Smith' },
  ];

  const workHoursOptions: DropdownOption[] = [
    { value: 'total', label: 'Total Work Hours' },
    { value: 'regular', label: 'Regular Hours' },
    { value: 'overtime', label: 'Overtime Hours' },
  ];

  const periodOptions: DropdownOption[] = [
    { value: '10-days', label: 'Previous 10 Days' },
    { value: '30-days', label: 'Previous 30 Days' },
    { value: '90-days', label: 'Previous 90 Days' },
  ];

  const monthOptions: DropdownOption[] = [
    { value: 'current', label: 'Current Month' },
    { value: 'last', label: 'Last Month' },
    { value: 'custom', label: 'Custom Range' },
  ];

  return (
    <div className="w-full bg-gray-50">
      <Card className="w-full max-w-full mx-auto bg-white rounded-[24px] border-[1.1px] border-[#C6E6FB] rounded-lg">
        <CardHeader className="pb-4 px-4 sm:px-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
              <CardTitle className="font-semibold text-[16px] leading-[28px] tracking-[0.5px] text-gray-900">
                Attendance Summary
              </CardTitle>
              <p className="font-normal text-[12px] leading-[21px] tracking-[0.5px] text-gray-500 mt-1">
                Attendance from 1-12 Dec, 2025
              </p>
              </div>
              
              {/* Filter Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <DropdownButton
                  value={selectedEmployee}
                  onValueChange={setSelectedEmployee}
                  options={employeeOptions}
                  className="w-full sm:w-auto min-w-[80px]"
                />
                
                <DropdownButton
                  value={workHours}
                  onValueChange={setWorkHours}
                  options={workHoursOptions}
                  className="w-full sm:w-auto min-w-[80px]"
                />
                
                <DropdownButton
                  value={period}
                  onValueChange={setPeriod}
                  options={periodOptions}
                  className="w-full sm:w-auto min-w-[80px]"
                />
                
                <DropdownButton
                  value={currentMonth}
                  onValueChange={setCurrentMonth}
                  options={monthOptions}
                  className="w-full sm:w-auto min-w-[80px]"
                />
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-start lg:justify-end gap-4 lg:gap-6">
            {legendItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color, width: '10px', height: '10px' }}
                />
                <span className="text-[12px] leading-[12px] tracking-[0.5px] font-semibold text-gray-600">
                  {item.label}
                </span>
              </div>
            ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 px-4 sm:px-6">
          {/* Chart Container with hidden scrollbar */}
          <div className="relative overflow-x-auto scrollbar-hide" style={{
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none'  /* IE and Edge */
          }}>
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none; /* Chrome, Safari and Opera */
              }
            `}</style>
            <div className="min-w-max">
              {/* Chart area with grid lines */}
              <div className="relative">
                {/* Y-axis labels */}
                <div className="absolute border-r left-0 top-0 h-44 flex flex-col justify-between text-right text-gray-500 z-10">
                  {timeLabels.map((time, index) => (
                    <span
                      key={index}
                      className="bg-white pr-2 font-semibold text-[10px] leading-[11px] tracking-[0.5px]"
                    >
                      {time}
                    </span>
                  ))}
                </div>
                {/* Horizontal grid lines */}
                <div className="absolute top-0 right-0 h-44 w-full border-b border-gray-300">
                  <div className="pl-12 h-full relative">
                    {timeLabels.map((_, index) => (
                      <div
                        key={index}
                        className="absolute w-full border-t border-gray-200 border-dashed"
                        style={{
                          top: `${(index / (timeLabels.length - 1)) * 100}%`,
                          borderStyle: 'dashed',
                          borderImage:
                            'repeating-linear-gradient(to right, #e5e7eb 0 8px, transparent 8px 16px) 100% 1',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Chart bars */}
                <div className="ml-12 relative">
                <div className="flex items-end h-44 gap-[17px]">
                {attendanceData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center w-[17px]">
                    <div className="flex items-end justify-center h-38 w-[17px]">
                      <div className="flex items-end w-[17px]">
                        {renderBar(data, index)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

                  {/* X-axis labels */}
                  <div className="flex justify-between mt-2 pb-4">
                  {attendanceData.map((data, index) => (
                    <div
                      key={index}
                      className="text-[8px] leading-[11px] tracking-[0.5px] font-semibold text-gray-500 text-center min-w-[16px]"
                    >
                      {data.date}
                    </div>
                  ))}
                </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceSummaryDisplay;