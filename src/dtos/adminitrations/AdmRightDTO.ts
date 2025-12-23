import { BaseDTO } from '@/dtos/BaseDTO';
import AdmFeature from './AdmFeature';
import AdmFunction from './AdmFunction';
import AdmFeatureFunction from './AdmFeatureFunction';
import BuildRightConfig from '@/entities/admin/BuildConfigRight';

export default class AdmRightDTO extends BaseDTO {
  public FeatureWeb?: Array<AdmFeature>;
  public Filter?: AdmRightFilter;
  public FeatureId?: number;
  public Functions?: Array<AdmFunction>;
  public FeatureFunctions?: Array<AdmFeatureFunction>;
  public BuildRightConfigs?: Array<BuildRightConfig>;
}

export class AdmRightFilter {
  public name?: string;
  public code?: string;
}
