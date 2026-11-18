(fn RixeScopeTick ()
  (bind w (Variables|Default|GetCurrentWeapon))
  (Utilities|IsValid w
    (:"Is Valid"
      (bind wid (Class|BPShooterWeaponBase|GetRixeWeaponId w))
      (bind bits (Math|Integer|BitwiseAND (Class|BPShooterWeaponBase|GetRixeAttachBits w) (Class|BPShooterWeaponBase|GetRixeAllowedAttach w)))
      (bind scoped (or (or (Utilities|String|Equal,CaseInsensitive(String) wid "Sniper") (Utilities|String|Equal,CaseInsensitive(String) wid "DMR")) (!= (Math|Integer|BitwiseAND bits 2) 0)))
      (bind dead (CallFunction|IsDead))
      (CallFunction|RixeScopeApply :Show (and scoped (and (> (Variables|Default|GetRixeAdsAlpha) 0.8) (not dead)))))
    (:"Is Not Valid"
      (CallFunction|RixeScopeApply :Show false))))
