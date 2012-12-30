function defineMixin(mixinName, properties) {
  window[mixinName] = properties;
  window[mixinName].__mixin_name = mixinName;
}
defineMixin.kMixinNameKey = '__mixin_name';