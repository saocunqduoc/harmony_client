import { Link } from "react-router-dom";
import { Business } from "../../api/services/businessService";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { MapPin, Phone, Mail } from "lucide-react";

interface BusinessCardProps {
  business: Business;
}

export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="h-40 overflow-hidden bg-gray-100">
        {business.coverImage ? (
          <img
            src={business.coverImage}
            alt={`${business.name} cover`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            No Cover Image
          </div>
        )}
      </div>

      <CardHeader className="pb-2 relative">
        <div className="absolute -top-10 left-4 w-16 h-16 rounded-full overflow-hidden border-4 border-white bg-white shadow-sm">
          {business.logo ? (
            <img
              src={business.logo}
              alt={`${business.name} logo`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-xs">
              Logo
            </div>
          )}
        </div>
        <div className="ml-20">
          <CardTitle className="text-lg font-semibold line-clamp-1">{business.name}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {business.description && (
          <CardDescription className="text-sm line-clamp-2">
            {business.description}
          </CardDescription>
        )}
        
        <div className="flex flex-col gap-1 text-sm">
          {business.address && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
              <span className="line-clamp-2 text-gray-600">
                {business.address}, {business.ward}, {business.district}, {business.city}
              </span>
            </div>
          )}
          
          {business.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-gray-600">{business.phone}</span>
            </div>
          )}
          
          {business.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-gray-600 truncate">{business.email}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="mt-auto pt-2">
        <Button asChild className="w-full">
          <Link to={`/business/${business.id}`}>
            Xem thông tin
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}