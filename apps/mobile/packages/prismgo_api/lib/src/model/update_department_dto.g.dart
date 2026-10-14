// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_department_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$UpdateDepartmentDtoCWProxy {
  UpdateDepartmentDto name(String? name);

  UpdateDepartmentDto costCentre(String? costCentre);

  UpdateDepartmentDto hodUserId(String? hodUserId);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `UpdateDepartmentDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// UpdateDepartmentDto(...).copyWith(id: 12, name: "My name")
  /// ````
  UpdateDepartmentDto call({
    String? name,
    String? costCentre,
    String? hodUserId,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfUpdateDepartmentDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfUpdateDepartmentDto.copyWith.fieldName(...)`
class _$UpdateDepartmentDtoCWProxyImpl implements _$UpdateDepartmentDtoCWProxy {
  const _$UpdateDepartmentDtoCWProxyImpl(this._value);

  final UpdateDepartmentDto _value;

  @override
  UpdateDepartmentDto name(String? name) => this(name: name);

  @override
  UpdateDepartmentDto costCentre(String? costCentre) =>
      this(costCentre: costCentre);

  @override
  UpdateDepartmentDto hodUserId(String? hodUserId) =>
      this(hodUserId: hodUserId);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `UpdateDepartmentDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// UpdateDepartmentDto(...).copyWith(id: 12, name: "My name")
  /// ````
  UpdateDepartmentDto call({
    Object? name = const $CopyWithPlaceholder(),
    Object? costCentre = const $CopyWithPlaceholder(),
    Object? hodUserId = const $CopyWithPlaceholder(),
  }) {
    return UpdateDepartmentDto(
      name: name == const $CopyWithPlaceholder()
          ? _value.name
          // ignore: cast_nullable_to_non_nullable
          : name as String?,
      costCentre: costCentre == const $CopyWithPlaceholder()
          ? _value.costCentre
          // ignore: cast_nullable_to_non_nullable
          : costCentre as String?,
      hodUserId: hodUserId == const $CopyWithPlaceholder()
          ? _value.hodUserId
          // ignore: cast_nullable_to_non_nullable
          : hodUserId as String?,
    );
  }
}

extension $UpdateDepartmentDtoCopyWith on UpdateDepartmentDto {
  /// Returns a callable class that can be used as follows: `instanceOfUpdateDepartmentDto.copyWith(...)` or like so:`instanceOfUpdateDepartmentDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$UpdateDepartmentDtoCWProxy get copyWith =>
      _$UpdateDepartmentDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UpdateDepartmentDto _$UpdateDepartmentDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('UpdateDepartmentDto', json, ($checkedConvert) {
      final val = UpdateDepartmentDto(
        name: $checkedConvert('name', (v) => v as String?),
        costCentre: $checkedConvert('costCentre', (v) => v as String?),
        hodUserId: $checkedConvert('hodUserId', (v) => v as String?),
      );
      return val;
    });

Map<String, dynamic> _$UpdateDepartmentDtoToJson(
  UpdateDepartmentDto instance,
) => <String, dynamic>{
  'name': ?instance.name,
  'costCentre': ?instance.costCentre,
  'hodUserId': ?instance.hodUserId,
};
