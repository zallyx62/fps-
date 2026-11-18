(fn RixeScopeApply (Show)
  (if (!= Show (Variables|Default|GetRixeScopeOn))
    (Variables|Default|SetRixeScopeOn Show)
    (Rendering|SetVisibility (Variables|Default|GetFirstPersonMesh) (not Show) true)
    (for wp (Variables|Default|GetOwnedWeapons)
      (Rendering|SetVisibility (Class|BPShooterWeaponBase|GetFPWeapon wp) false false))
    (Utilities|IsValid (Variables|Default|GetRixeScopeUI)
      (:"Is Valid"
        (if Show
          (Widget|SetVisibility (Variables|Default|GetRixeScopeUI) "HitTestInvisible")
          (else
            (Widget|SetVisibility (Variables|Default|GetRixeScopeUI) "Collapsed"))))
      (:"Is Not Valid"
        (if Show
          (bind found (Widget|GetAllWidgetsOfClass :WidgetClass "/Game/Rixe/UI/WBP_RixeScope.WBP_RixeScope_C" :TopLevelOnly true))
          (if (> (Utilities|Array|Length found) 0)
            (Variables|Default|SetRixeScopeUI (Utilities|Array|Get(acopy) found 0))
            (else
              (Variables|Default|SetRixeScopeUI (UserInterface|CreateWidget :Class "/Game/Rixe/UI/WBP_RixeScope.WBP_RixeScope_C" :OwningPlayer (Game|GetPlayerController 0)))
              (UserInterface|Viewport|AddtoViewport (Variables|Default|GetRixeScopeUI) -10)))
          (Widget|SetVisibility (Variables|Default|GetRixeScopeUI) "HitTestInvisible"))))))
