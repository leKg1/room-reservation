import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

export interface VipCheckResponse {
  isVip: boolean;
  tier?: string;
  benefits?: string[];
}

@Injectable()
export class VipCheckService {
  private readonly logger = new Logger(VipCheckService.name);
  private readonly vipApiUrl = process.env['VIP_API_URL'] || 'https://api.example.com/vip/check';

  async checkVipStatus(email: string): Promise<VipCheckResponse> {
    try {
      // Simulate external VIP API call
      const response = await axios.post(this.vipApiUrl, {
        email,
        timestamp: new Date().toISOString(),
      }, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env['VIP_API_TOKEN'] || 'dummy-token'}`,
        }
      });

      return {
        isVip: response.data.isVip || false,
        tier: response.data.tier,
        benefits: response.data.benefits,
      };
    } catch (error: any) {
      this.logger.warn(`VIP check failed for ${email}: ${error.message}`);
      
      // Mock VIP check logic when external API is not available
      return this.mockVipCheck(email);
    }
  }

  private mockVipCheck(email: string): VipCheckResponse {
    // Simple mock logic - emails with 'vip' in domain or specific patterns
    const isVip = email.includes('vip') || email.endsWith('@premium.com') || email.endsWith('@gold.com');

    return {
      isVip,
      tier: isVip ? (Math.random() < 0.5 ? 'Gold' : 'Silver') : undefined,
      benefits: isVip ? ['Priority Support', 'Room Upgrade', 'Late Checkout'] : undefined,
    };
  }
} 