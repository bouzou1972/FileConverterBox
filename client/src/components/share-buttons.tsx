import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, Twitter, Facebook, Linkedin, Link, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonsProps {
  title: string;
  description: string;
  url?: string;
}

export function ShareButtons({ title, description, url }: ShareButtonsProps) {
  const { toast } = useToast();
  const shareUrl = url || window.location.href;
  const shareText = `${title} - ${description}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "URL copied to clipboard successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=fileconverter,onlinetools,productivity`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
  };

  const shareOnLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`;
    window.open(linkedinUrl, '_blank', 'width=550,height=420');
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        copyLink(); // Fallback to copy link
      }
    } else {
      copyLink(); // Fallback for browsers without native share
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Share2 className="w-5 h-5" />
          Share This Tool
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={nativeShare}
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={shareOnTwitter}
            className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200"
          >
            <Twitter className="w-4 h-4" />
            Twitter
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={shareOnFacebook}
            className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200"
          >
            <Facebook className="w-4 h-4" />
            Facebook
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={shareOnLinkedIn}
            className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200"
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={copyLink}
            className="flex items-center gap-2"
          >
            <Link className="w-4 h-4" />
            Copy Link
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 mt-3">
          Help others discover this free tool by sharing it with your network
        </p>
      </CardContent>
    </Card>
  );
}