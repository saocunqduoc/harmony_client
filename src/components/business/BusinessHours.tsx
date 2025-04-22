
import React from 'react';
import { Clock } from 'lucide-react';
import { BusinessHoursResponse } from '@/api/services/businessHoursService';
import { translateWeekday } from '@/utils/dateUtils';

interface BusinessHoursProps {
  businessHours: BusinessHoursResponse | null;
}

const BusinessHours = ({ businessHours }: BusinessHoursProps) => {
  if (!businessHours || !businessHours.formattedData) {
    return (
      <div className="text-muted-foreground">Không có thông tin giờ làm việc</div>
    );
  }
  
  const { openHours, closedHours } = businessHours.formattedData;
  const openHoursArray = openHours.split('\n');
  
  return (
    <div className="space-y-2">
      {openHoursArray.length > 0 && openHoursArray.map((hours, index) => {
        // Parse the hours string to extract days and times
        const match = hours.match(/(.*)\s(\d{2}:\d{2}:\d{2})\s-\s(\d{2}:\d{2}:\d{2})/);
        if (match) {
          const [_, days, openTime, closeTime] = match;
          
          // Translate day names to Vietnamese
          let vietnameseDays = days;
          Object.entries(translateWeekday).forEach(([english, vietnamese]) => {
            vietnameseDays = vietnameseDays.replace(new RegExp(english, 'g'), vietnamese);
          });
          
          return (
            <div key={index} className="flex justify-between">
              <span className="text-muted-foreground">{translateWeekday(days)}</span>
              <span>
                {openTime.substring(0, 5)} - {closeTime.substring(0, 5)}
              </span>
            </div>
          );
        }
        return (
          <div key={index} className="flex justify-between">
            <span className="text-muted-foreground">{hours}</span>
          </div>
        );
      })}
      
      {closedHours && closedHours !== "Không đóng cửa ngày nào" && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {closedHours.includes("Sunday") ? translateWeekday("Sunday") : 
             closedHours.includes("Monday") ? translateWeekday("Monday") :
             closedHours.includes("Tuesday") ? translateWeekday("Tuesday") :
             closedHours.includes("Wednesday") ? translateWeekday("Wednesday") :
             closedHours.includes("Thursday") ? translateWeekday("Thursday") :
             closedHours.includes("Friday") ? translateWeekday("Friday") :
             closedHours.includes("Saturday") ? translateWeekday("Saturday") : 
             closedHours}
          </span>
          <span>Đóng cửa</span>
        </div>
      )}
    </div>
  );
};

export default BusinessHours;
