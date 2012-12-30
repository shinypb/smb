defineMixin('SMCollisionDetection', {
  colliding: function(bounds1, bounds2) {
    if (bounds1[kSMBottom] < bounds2[kSMTop])    return false;
    if (bounds1[kSMTop]    > bounds2[kSMBottom]) return false;
    if (bounds1[kSMRight]  < bounds2[kSMLeft])   return false;
    if (bounds1[kSMLeft]   > bounds2[kSMRight])  return false;

    return true;
  }
});