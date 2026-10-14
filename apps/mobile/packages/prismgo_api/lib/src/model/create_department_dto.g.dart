// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_department_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$CreateDepartmentDtoCWProxy {
  CreateDepartmentDto name(String name);

  CreateDepartmentDto costCentre(String? costCentre);

  CreateDepartmentDto hodUserId(String? hodUserId);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `CreateDepartmentDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// CreateDepartmentDto(...).copyWith(id: 12, name: "My name")
  /// ````
  CreateDepartmentDto call({
    String name,
    String? costCentre,
    String? hodUserId,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfCreateDepartmentDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfCreateDepartmentDto.copyWith.fieldName(...)`
class _$CreateDepartmentDtoCWProxyImpl implements _$CreateDepartmentDtoCWProxy {
  const _$CreateDepartmentDtoCWProxyImpl(this._value);

  final CreateDepartmentDto _value;

  @override
  CreateDepartmentDto name(String name) => this(name: name);

  @override
  CreateDepartmentDto costCentre(String? costCentre) =>
      this(costCentre: costCentre);

  @override
  CreateDepartmentDto hodUserId(String? hodUserId) =>
      this(hodUserId: hodUserId);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `CreateDepartmentDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// CreateDepartmentDto(...).copyWith(id: 12, name: "My name")
  /// ````
  CreateDepartmentDto call({
    Object? name = const $CopyWithPlaceholder(),
    Object? costCentre = const $CopyWithPlaceholder(),
    Object? hodUserId = const $CopyWithPlaceholder(),
  }) {
    return CreateDepartmentDto(
      name: name == const $CopyWithPlaceholder()
          ? _value.name
          // ignore: cast_nullable_to_non_nullable
          : name as String,
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

extension $CreateDepartmentDtoCopyWith on CreateDepartmentDto {
  /// Returns a callable class that can be used as follows: `instanceOfCreateDepartmentDto.copyWith(...)` or like so:`instanceOfCreateDepartmentDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$CreateDepartmentDtoCWProxy get copyWith =>
      _$CreateDepartmentDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CreateDepartmentDto _$CreateDepartmentDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('CreateDepartmentDto', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['name']);
      final val = CreateDepartmentDto(
        name: $checkedConvert('name', (v) => v as String),
        costCentre: $checkedConvert('costCentre', (v) => v as String?),
        hodUserId: $checkedConvert('hodUserId', (v) => v as String?),
      );
      return val;
    });

Map<String, dynamic> _$CreateDepartmentDtoToJson(
  CreateDepartmentDto instance,
) => <String, dynamic>{
  'name': instance.name,
  'costCentre': ?instance.costCentre,
  'hodUserId': ?instance.hodUserId,
};
