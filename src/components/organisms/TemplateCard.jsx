import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const TemplateCard = ({ template, onUse }) => {
  const serviceIconMap = {
    Gmail: "Mail",
    Slack: "MessageSquare",
    Typeform: "FileText",
    HubSpot: "Users",
    Schedule: "Clock",
    "Google Sheets": "Sheet",
    Instagram: "Instagram",
    Twitter: "Twitter",
    Facebook: "Facebook",
    Dropbox: "Cloud",
    "Google Drive": "HardDrive",
    Zendesk: "Headphones"
  };

  const getPopularityColor = (popularity) => {
    if (popularity >= 80) return "success";
    if (popularity >= 60) return "warning";
    return "default";
  };

  return (
    <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-gray-200 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors mb-1">
              {template.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {template.description}
            </p>
          </div>
          <Badge 
            variant={getPopularityColor(template.popularity)}
            className="ml-2 flex-shrink-0"
          >
            {template.popularity}% popular
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {template.category}
          </Badge>
          <div className="flex items-center text-sm text-gray-500">
            <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
            {template.estimatedTime}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Service Icons */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          {template.services.map((service, index) => (
            <div key={index} className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-primary/10 group-hover:to-secondary/10 rounded-lg flex items-center justify-center transition-colors">
                <ApperIcon 
                  name={serviceIconMap[service] || "Zap"} 
                  className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" 
                />
              </div>
              {index < template.services.length - 1 && (
                <ApperIcon name="ArrowRight" className="w-4 h-4 text-gray-400 mx-2" />
              )}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <ApperIcon name="Zap" className="w-4 h-4 mr-1" />
              {template.triggers} trigger{template.triggers !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center">
              <ApperIcon name="Play" className="w-4 h-4 mr-1" />
              {template.actions} action{template.actions !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Use Template Button */}
        <Button
          onClick={() => onUse(template)}
          className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 group-hover:scale-105 transition-all duration-200"
        >
          <ApperIcon name="Download" className="w-4 h-4 mr-2" />
          Use Template
        </Button>

        {/* Difficulty Indicator */}
        <div className="flex items-center justify-center mt-3 space-x-2">
          <span className="text-xs text-gray-500">Setup time:</span>
          <div className="flex space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full",
                  i < Math.ceil(template.actions / 2)
                    ? "bg-primary"
                    : "bg-gray-200"
                )}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;